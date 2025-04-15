// client/src/components/investor/InvestorForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createInvestor, getInvestorById, updateInvestor } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Investor } from '../../types';

interface InvestorFormProps {
  isEditing?: boolean;
}

const InvestorForm: React.FC<InvestorFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const initialState: Omit<Investor, '_id' | 'userId' | 'createdAt' | 'updatedAt'> = {
    name: '',
    position: '',
    organization: '',
    investmentFocus: [''],
    preferredStages: [],
    preferredSectors: [],
    preferredCountries: [],
    minInvestmentRange: 10000,
    maxInvestmentRange: 100000,
    bio: '',
    portfolio: [],
    profileImage: '',
    contactDetails: {
      email: user?.email || '',
      phone: '',
      website: ''
    },
    socialProfiles: {
      linkedin: '',
      twitter: ''
    }
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [newFocus, setNewFocus] = useState<string>('');
  
  useEffect(() => {
    if (isEditing && id) {
      fetchInvestorData(id);
    }
  }, [isEditing, id]);

  const fetchInvestorData = async (investorId: string) => {
    try {
      setLoading(true);
      const response = await getInvestorById(investorId);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching investor:', error);
      setError('Failed to load investor data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof typeof formData) => {
    const options = e.target.options;
    const values = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFocusAdd = () => {
    if (newFocus.trim() && !formData.investmentFocus.includes(newFocus.trim())) {
      setFormData(prev => ({
        ...prev,
        investmentFocus: [...prev.investmentFocus, newFocus.trim()]
      }));
      setNewFocus('');
    }
  };

  const removeFocus = (focus: string) => {
    setFormData(prev => ({
      ...prev,
      investmentFocus: prev.investmentFocus.filter(f => f
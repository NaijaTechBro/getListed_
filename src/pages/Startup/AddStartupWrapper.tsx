// client/src/pages/AddStartupWrapper.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import StartupForm from '../../components/startup/StartupForm';

const AddStartupWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  return (
    <div>
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Startup' : 'Add New Startup'}</h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'Update your startup information on GetListed' 
            : 'List your startup on the African Startup Directory'}
        </p>
      </div> */}
      
      <StartupForm isEditing={isEditing} />
    </div>
  );
};

export default AddStartupWrapper;
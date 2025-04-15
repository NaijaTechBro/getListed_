// client/src/types/index.ts (adding to existing types)

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'startup' | 'investor' | 'admin';
    // Other relevant user fields
  }


  // client/src/types.ts

export interface Startup {
    _id: string;
    name: string;
    logo: string;
    tagline: string;
    description: string;
    website: string;
    category: string;
    subCategory: string;
    country: string;
    city: string;
    foundingDate: string;
    stage: string;
    products?: string;
    metrics: {
      fundingTotal: number;
      employees: number;
      revenue: string;
    };
    socialProfiles: {
      linkedin: string;
      twitter: string;
      facebook: string;
      instagram: string;
    };
    founders: Founder[];
    fundingRounds?: FundingRound[];
    createdBy: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Founder {
    name: string;
    role: string;
    linkedin: string;
    bio?: string;
  }
  
  export interface FundingRound {
    stage: string;
    date: string;
    amount: number;
    valuation?: number;
    investors?: string[];
    notes?: string;
  }
  
  export interface Investor {
    _id: string;
    userId: string; // Reference to User
    name: string;
    position: string;
    organization: string;
    investmentFocus: string[];
    preferredStages: string[];
    preferredSectors: string[];
    preferredCountries: string[];
    minInvestmentRange: number;
    maxInvestmentRange: number;
    bio: string;
    portfolio: InvestorPortfolio[];
    profileImage: string;
    contactDetails: {
      email: string;
      phone?: string;
      website?: string;
    };
    socialProfiles: {
      linkedin?: string;
      twitter?: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface InvestorPortfolio {
    startupName: string;
    startupId?: string; // If the startup is on the platform
    investmentDate: string;
    investmentStage: string;
    description?: string;
  }
  
  export interface Connection {
    _id: string;
    investorId: string;
    startupId: string;
    status: 'pending' | 'accepted' | 'rejected';
    message: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SavedStartup {
    investorId: string;
    startupId: string;
    note?: string;
    createdAt: string;
  }
  
  export interface StartupFilter {
    category?: string;
    country?: string;
    stage?: string;
    searchTerm?: string;
    fundingRange?: {
      min?: number;
      max?: number;
    };
    employeeCount?: {
      min?: number;
      max?: number;
    };
  }
// Award-specific field types extending the base form builder
export type AwardQuestionType =
    | 'multiple_choice'
    | 'checkbox'
    | 'dropdown'
    | 'short_answer'
    | 'paragraph'
    | 'student_nominee' // 1-4 students with name, branch, year
    | 'contact_info' // Email + phone validation
    | 'file_upload' // Project reports, documents
    | 'institution_address' // Structured address fields
    | 'guide_details' // Guide name, designation, contact
    | 'project_resume' // Word count limits (150-300 words)
    | 'discipline_selector' // Award-specific branch filtering
    | 'signature_section' // HOI signature with seal
    | 'membership_info' // Professional society membership
    | 'date' // Single date picker
    | 'date_range'; // From and to date range

// Student nominee information
export interface StudentNominee {
    name: string;
    branch: string;
    semester: string;
    year: string;
    email: string;
    mobile: string;
    membership?: string;
}

// Guide information
export interface GuideInfo {
    name: string;
    designation: string;
    department: string;
    email?: string;
    mobile?: string;
    address: string;
}

// Institution information
export interface InstitutionInfo {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    hoiName: string;
    hoiDesignation: string;
    seal?: File;
    signature?: File;
}

// File upload configuration
export interface FileUploadConfig {
    maxSize: number; // in MB
    allowedTypes: string[];
    required: boolean;
    description: string;
}

// Enhanced question interface for awards
export interface AwardQuestion {
    id: string;
    type: AwardQuestionType;
    title: string;
    description?: string;
    required: boolean;
    order: number;

    // Award-specific configurations
    awardTypes?: string[]; // Which awards use this field
    maxStudents?: number; // For nominee fields (1-4)
    minStudents?: number; // Minimum students required
    wordLimit?: { min?: number; max?: number }; // For text fields
    fileConfig?: FileUploadConfig; // For file uploads
    disciplines?: string[]; // Available disciplines for this award
    options?: Array<{ value: string; label?: string }>; // For dropdowns/checkboxes

    // Conditional display
    showIf?: {
        fieldId: string;
        value: string | string[];
    };
}

// Award configuration
export interface AwardConfig {
    id: string;
    name: string;
    description: string;
    category: 'student' | 'faculty' | 'institution';
    eligibility: {
        level?: 'UG' | 'PG' | 'Diploma' | 'All';
        states?: string[];
        branches?: string[];
        maxAge?: number;
    };
    deadlines: {
        submission: string;
        evaluation: string;
        result: string;
    };
    fields: AwardQuestion[];
    specialRequirements?: string[];
}

// Predefined disciplines by award
export const AWARD_DISCIPLINES = {
    'ptu-young-engineer': [
        'Civil Engineering & Architecture',
        'Mechanical, Production Engineering, Industrial Engineering and Automobiles Engineering',
        'Electrical Engineering & Electronics & Communication Engineering, Computer Science & Engineering and Information Technology',
        'Chemical Engineering, Bio-Technology & Food Technology',
    ],
    'devinder-singh-bansal': [
        'Mechanical Engineering',
        'Production Engineering',
        'Industrial Engineering',
        'Automobile Engineering',
    ],
    'narsee-monjee': ['All Diploma Branches'],
    'maharashtra-design': [
        'Civil Engineering',
        'Mechanical Engineering',
        'Electrical Engineering',
        'Electronics Engineering',
        'Computer Engineering',
        'Information Technology',
    ],
    'nit-kozhikode': [
        'Civil Engineering',
        'Mechanical Engineering',
        'Electrical & Electronics Engineering',
        'Computer Science & Engineering',
        'Electronics & Communication Engineering',
    ],
    'kerala-design': ['All UG Engineering Branches'],
    'bbsbec-sustainable': [
        'Civil Engineering',
        'Mechanical Engineering',
        'Electrical & Electronics Engineering',
        'Computer Science & Engineering',
        'Information Technology',
        'Agriculture Engineering',
    ],
} as const;

// Award templates with pre-configured fields
export const AWARD_TEMPLATES: Record<string, Omit<AwardConfig, 'id'>> = {
    'ptu-young-engineer': {
        name: 'PTU-Young Engineer Innovators Award',
        description: 'For innovative engineering projects by students',
        category: 'student',
        eligibility: {
            level: 'UG',
            branches: [...AWARD_DISCIPLINES['ptu-young-engineer']],
        },
        deadlines: {
            submission: '2024-12-31',
            evaluation: '2025-01-31',
            result: '2025-02-28',
        },
        fields: [], // Will be populated with common + specific fields
        specialRequirements: [
            'Project significance section required',
            'Detailed resume of project with impact analysis',
        ],
    },
    'narsee-monjee': {
        name: 'ISTE-Narsee Monjee Award',
        description: 'For polytechnic students excellence',
        category: 'student',
        eligibility: {
            level: 'Diploma',
            branches: [...AWARD_DISCIPLINES['narsee-monjee']],
        },
        deadlines: {
            submission: '2024-12-31',
            evaluation: '2025-01-31',
            result: '2025-02-28',
        },
        fields: [],
        specialRequirements: [
            'Up to 4 polytechnic students allowed',
            'Diploma level projects only',
        ],
    },
    'maharashtra-design': {
        name: 'Maharashtra State Engineering Design Award',
        description: 'For design innovation in Maharashtra',
        category: 'student',
        eligibility: {
            level: 'UG',
            states: ['Maharashtra'],
            branches: [...AWARD_DISCIPLINES['maharashtra-design']],
        },
        deadlines: {
            submission: '2024-12-31',
            evaluation: '2025-01-31',
            result: '2025-02-28',
        },
        fields: [],
        specialRequirements: [
            'Only UG students from Maharashtra eligible',
            'Design problem-solving process emphasis',
        ],
    },
};

// Common field templates
export const COMMON_AWARD_FIELDS = {
    studentNominees: {
        type: 'student_nominee' as AwardQuestionType,
        title: 'Student Nominee(s)',
        description: 'Enter details of student nominees',
        required: true,
        maxStudents: 2, // Default, can be overridden
        minStudents: 1,
    },
    projectTitle: {
        type: 'short_answer' as AwardQuestionType,
        title: 'Title of the Project (in capital letters)',
        description: 'Enter the project title in capital letters',
        required: true,
    },
    guideDetails: {
        type: 'guide_details' as AwardQuestionType,
        title: 'Name of Guide(s) and Address',
        description: 'Enter guide information',
        required: true,
    },
    projectResume: {
        type: 'project_resume' as AwardQuestionType,
        title: 'Brief Resume of the Project',
        description: 'Provide a brief resume of your project',
        required: true,
        wordLimit: { min: 150, max: 300 },
    },
    institutionAddress: {
        type: 'institution_address' as AwardQuestionType,
        title: 'Address of the Institution',
        description: 'Complete institution address',
        required: true,
    },
    projectReport: {
        type: 'file_upload' as AwardQuestionType,
        title: 'Detailed Project Report (Enclosure)',
        description: 'Upload your detailed project report',
        required: true,
        fileConfig: {
            maxSize: 10, // 10MB
            allowedTypes: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ] as string[],
            required: true,
            description: 'PDF or Word document, max 10MB',
        },
    },
    hoiSignature: {
        type: 'signature_section' as AwardQuestionType,
        title: 'Signature of Head of Institution',
        description: 'HOI signature with name, address, and office seal',
        required: true,
    },
} as const;

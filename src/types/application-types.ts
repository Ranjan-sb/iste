// Application Form Data Types
export interface Guide {
    name: string;
    address: string;
    email: string;
    mobile: string;
}

export interface FileData {
    id: number;
    filename: string;
    size: number;
    mimetype: string;
}

export interface Project {
    title: string;
    guides: Guide[];
    outstandingWorkArea: string;
    briefResume?: string;
    briefResumeFile?: FileData;
    institutionRemarks?: FileData;
    benefits: string[];
}

export interface TeachingExperience {
    ug: string;
    pg: string;
}

// Main application form data interface
export interface ApplicationFormData {
    // Personal Information
    applicantName?: string;
    designation?: string;
    address?: string;
    pincode?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    academicQualification?: string;
    fieldOfSpecialization?: string;

    // Professional Information
    department?: string;
    semesterYear?: string; // For students
    teachingExperience?: TeachingExperience;
    industryExperience?: string;
    otherExperience?: string;
    isMember?: boolean;
    institutionAddress?: string;

    // Project Information
    projects?: Project[];

    // Custom form fields (dynamic based on award configuration)
    [key: string]: any;
}

// Type guard for safe type checking
export function isApplicationFormData(
    data: unknown,
): data is ApplicationFormData {
    return typeof data === 'object' && data !== null;
}

// Utility function for safe property access
export function getFormDataProperty<K extends keyof ApplicationFormData>(
    formData: unknown,
    key: K,
): ApplicationFormData[K] | undefined {
    if (isApplicationFormData(formData)) {
        return formData[key];
    }
    return undefined;
}

import { EGender, EMaritalStatus, PaginatedResponse } from ".";
import { ECountry } from "./country.type";

export interface IStudentAsLead {
    gender: EGender;
    address: string;
    country: ECountry;
    interestedCourse: string;
}

export interface IStudentDocuments {
    cv: string;
    gradeTenMarksheet: string;
    gradeElevenMarksheet?: string;
    gradeTwelveMarksheet: string;
    passport: string;
    ielts: string;
    recommendationLetter: string;
    workExperience?: string;
}

export interface IStudentAddress {
    address1: string;
    address2?: string;
    city: string;
    country: ECountry;
    state: string;
    zipCode: number;
}

export interface IStudentPassport {
    number: string;
    issueDate: string;
    expiryDate: string;
    issueCountry: ECountry;
    cityOfBrith: string;
    countryOfBrith: ECountry;
}

export interface IStudentNationality {
    nationality: ECountry;
    citizenship: ECountry;
    livingAndStudyingCountry: ECountry;
    otherCountriesCitizenship?: ECountry[];
}

export interface IStudentBackgroundInfo {
    appliedImmigrationCountry?: ECountry;
    medicalCondition: string;
    visaRefusalCountries: ECountry[];
    criminalRecord?: string;
}

export interface IStudentEmergencyContact {
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
}

export interface IStudentPersonalInfo {
    dob: string;
    gender: EGender;
    maritalStatus: EMaritalStatus;
    mailingAddress: IStudentAddress;
    permanentAddress: IStudentAddress;
    passport: IStudentPassport;
    nationality: IStudentNationality;
    backgroundInfo: IStudentBackgroundInfo;
    emergencyContact: IStudentEmergencyContact;
}

export enum ELevelOfEducation {
    Postgraduate = 'postgraduate',
    Undergraduate = 'undergraduate',
    Grade12 = 'grade_12',
    Grade10 = 'grade_10',
}

export enum EGradingSystem {
    CGPA = 'CGPA',
    Percentage = 'Percentage',
    Marks = 'Marks',
    Scale = 'Scale',
}

export interface IStudentLevelOfStudy {
    levelOfStudy: ELevelOfEducation;
    nameOfBoard: string;
    nameOfInstitution: string
    country: ECountry;
    state: string;
    city: string;
    degreeAwarded: string;
    gradingSystem: EGradingSystem;
    score: number;
    primaryLanguage: string;
    startDate: string;
    endDate: string;
}

export interface IStudentAcademicQualification {
    countryOfEducation: ECountry;
    highestLevelOfEducation: ELevelOfEducation;
    levelOfStudies?: {
        [ELevelOfEducation.Postgraduate]?: IStudentLevelOfStudy;
        [ELevelOfEducation.Undergraduate]?: IStudentLevelOfStudy;
        [ELevelOfEducation.Grade12]?: IStudentLevelOfStudy;
        [ELevelOfEducation.Grade10]?: IStudentLevelOfStudy;
    };
}

export enum EModeOfSalary {
    Cash = 'cash',
    Bank = 'bank',
    Cheque = 'cheque',
}

export interface IStudentWorkExperience {
    organization: string;
    position: string;
    jobProfile: string;
    workingFrom: string;
    workingTo?: string;
    modeOfSalary: EModeOfSalary;
    comment?: string;
}

export type TStudent = {
    id: string;
    refNo: string;
    fullName: string;
    email: string;
    createdAt: string;
    phoneNumber: string;
    statusMessage: string;
    createdBy: {
        id: string;
        lowerCasedFullName: string;
    } | null
    applicationsCount: number
}

export type TStudentsResponse = PaginatedResponse<TStudent>;

export type TSingleStudent = Pick<TStudent, 'id' | 'refNo' | 'fullName' | 'email' | 'createdAt' | 'phoneNumber' | 'statusMessage'> & {
    firstName: string,
    lastName: string,
    personalInfo: IStudentPersonalInfo | undefined,
    academicQualification: IStudentAcademicQualification | undefined,
    documents: IStudentDocuments | undefined,
    workExperiences: IStudentWorkExperience[] | undefined,
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  username: string;
  requestCount: number;
  uploadCount: number;
  uploadTotalMB: number;
}


export interface EmailAddress {
  emailAddress: string;
}
export interface PhoneNumber {
  phoneNumber: string;
}

export interface CreateUserParams {
    externalId?: string;
    emailAddress: string[];
    phoneNumber?: string[];
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    publicMetadata?:Record<string, unknown>;
    privateMetadata?:	Record<string, unknown>;
    unsafeMetadata?: Record<string, unknown>;
}

export interface UpdateUserParams {
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    skipPasswordChecks?: boolean;
    signOutOfOtherSessions?: boolean;
    primaryEmailAddressID?: string;
    primaryPhoneNumberID?: string;
    primaryWeb3WalletID?: string;
    profileImageID?: string;
    totpSecret?: string;
    backupCodes?: string[];
    externalId?: string;
    createdAt?: Date;
}
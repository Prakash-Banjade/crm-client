import { PaginatedResponse } from ".";
import { ECounselorType } from "../schema/counselor.schema";

export type TCounselor = {
    id: string;
    phoneNumber: string;
    type: ECounselorType;
    seeAndReceiveApplicationNotifications: boolean;
    hideCommissionFromPromotionalContent: boolean;
    hideSensitiveChatContent: boolean;
    exportApplicationToExcel: boolean;
    reassignStudents: boolean;
    showCommissionInfo: boolean;
    createdAt: string;
    account: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        organization: {
            id: string;
            name: string;
        }
    }
    createdBy: {
        id: string;
        lowerCasedFullName: string;
    } | null
}

export type TCounselorsResponse = PaginatedResponse<TCounselor>;
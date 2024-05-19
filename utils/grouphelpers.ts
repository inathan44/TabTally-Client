import axios from 'axios';
import type {
  AddMembersRequestBody,
  CreateGroupRequestBody,
  CreateGroupResponse,
  GetGroupResponse,
  Group,
  GroupMember,
  GroupMemberStatus,
  UpdateGroupRequestBody,
} from '../types/api';

export async function createGroup(
  reqBody: CreateGroupRequestBody,
  token: string
) {
  const response = await axios.post<GetGroupResponse>(
    'http://localhost:5217/api/v1/Groups/create',
    reqBody,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }
  );
  return response;
}

export async function getGroup(groupId: number, token: string) {
  const response = await axios.get<GetGroupResponse>(
    `http://localhost:5217/api/v1/Groups/${groupId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }
  );
  return response;
}

export async function getAllGroups() {
  const response = await axios.get<Group[]>(
    'http://localhost:5217/api/v1/Groups'
  );
  return response;
}

export async function updateGroup(
  groupId: number,
  reqBody: UpdateGroupRequestBody,
  token: string
) {
  const response = await axios.put<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/update`,
    reqBody,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function addMembers(
  groupId: number,
  reqBody: AddMembersRequestBody,
  token: string
) {
  const response = await axios.post<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/addmembers`,
    reqBody,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function changeStatus(
  groupId: number,
  memberId: string,
  reqBody: GroupMemberStatus,
  token: string
) {
  const response = await axios.put<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/changestatus/${memberId}`,
    reqBody,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function promoteMemberToAdmin(
  groupId: number,
  memberId: string,
  token: string
) {
  const response = await axios.put<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/promote/${memberId}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function demoteAdminToMember(
  groupId: number,
  memberId: string,
  token: string
) {
  const response = await axios.put<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/demote/${memberId}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function deleteGroup(groupId: number, token: string) {
  const response = await axios.delete<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/delete`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function getAllGroupMembers() {
  const response = await axios.get<GroupMember[]>(
    'http://localhost:5217/api/v1/Groups/members'
  );
  return response;
}

export async function leaveGroup(groupId: number, token: string) {
  const response = await axios.delete<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/leave`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function removeMember(
  groupId: number,
  memberId: string,
  token: string
) {
  const response = await axios.delete<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/removemember/${memberId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

export async function transferGroupOwnership(
  groupId: number,
  memberId: string,
  token: string
) {
  const response = await axios.put<string>(
    `http://localhost:5217/api/v1/Groups/${groupId}/transferownership/${memberId}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}

import axios, { AxiosError } from 'axios';
import { UpdateUserBody } from '../types/api';
import {
  createUserWithEmailAndPassword,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { faker } from '@faker-js/faker';
import type { User as DbUser, Group } from '../types/api';

export async function updateUser(
  userId: string,
  body: UpdateUserBody,
  token: string
) {
  return await axios.put(
    `http://localhost:5217/api/v1/users/${userId}/update`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer: ${token}`,
      },
    }
  );
}

async function createUserInDb(body: UpdateUserBody, token: string) {
  return await axios.post('http://localhost:5217/api/v1/Users/create', body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteUserFromDbAndFirebase(
  userId: string,
  token: string
) {
  return await axios.delete(
    `http://localhost:5217/api/v1/Users/${userId}/delete`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function createUserInDbAndFirebase(body: UpdateUserBody) {
  let updatedCreatedUserStatus;
  if (!body.email) {
    throw new Error('Email is undefined');
  }
  if (!body.firstName) {
    throw new Error('First name is undefined');
  }
  if (!body.lastName) {
    throw new Error('Last name is undefined');
  }
  if (!body.username) {
    throw new Error('Username is undefined');
  }
  // Create a user in firebase
  let createdUserObject: UserCredential;
  try {
    createdUserObject = await createUserWithEmailAndPassword(
      auth,
      body.email,
      // THESE ARE MOCK USERS THAT IS WHY THIS IS HARD CODED
      'password'
    );
  } catch (error) {
    console.error('error creating user in firebase', error);
    throw new Error('Error creating user in firebase');
  }

  /* update the user, the user will be created because of FOC middleware then updated */
  try {
    const token = await createdUserObject.user.getIdToken();

    const response = await createUserInDb(body, token);
    updatedCreatedUserStatus = response.status;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('error creating user', axiosError.response?.data);
    // Delete the user in firebase if there is an error
    await deleteUserFromDbAndFirebase(
      createdUserObject.user.uid,
      await createdUserObject.user.getIdToken()
    );
    throw new Error(
      `Error creating user: ${axiosError.response?.status}, ${JSON.stringify(
        axiosError.response?.data
      )}`
    );
  }
  return {
    firebaseUser: createdUserObject.user,
    firebaseToken: await createdUserObject.user.getIdToken(),
    status: updatedCreatedUserStatus,
    mockUser: body,
  };
}

export function generateMockUserInformation() {
  const email = faker.internet.email();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.userName();

  return { email, firstName, lastName, username };
}

export async function getUser(userId: string, token: string) {
  return await axios.get<DbUser>(
    `http://localhost:5217/api/v1/users/${userId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// THIS ROUTE IS ONLY FOR TESTING PURPOSES
export async function getAllUsers() {
  return await axios.get<DbUser[]>('http://localhost:5217/api/v1/Users', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getUserGroups(token: string) {
  return await axios.get<Group[]>('http://localhost:5217/api/v1/Users/groups', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

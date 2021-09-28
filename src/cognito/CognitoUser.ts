import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognito = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

/**
 * User object
 */
class CognitoUser {
  constructor({ sub, username }: { sub: string; username: string }) {
    this.sub = sub;
    this.username = username;
  }

  /**
   * Get the user and return attributes
   */
  async getUser() {
    if (this.attributes) {
      return this.attributes;
    }

    if (!process.env.AUTH_USERPOOLID) {
      throw new Error('Environment variable AUTH_USERPOOLID is not set.');
    }

    const user = await cognito
      .adminGetUser({
        UserPoolId: process.env.AUTH_USERPOOLID,
        Username: this.username,
      })
      .promise();

    this.attributes = user.UserAttributes?.reduce((prev, cur) => {
      prev[cur.Name] = cur.Value;
      return prev;
    }, {});

    return this.attributes;
  }

  getUsername() {
    return this.username;
  }

  getUserSub() {
    return this.sub;
  }

  async getAttribute(key: string) {
    const user = await this.getUser();
    return user[key];
  }

  async getAttributes() {
    const user = await this.getUser();
    return user;
  }

  async getGroups() {
    if (this.groups) {
      return this.groups;
    }

    const groupsResult = await cognito
      .adminListGroupsForUser({
        UserPoolId: process.env.AUTH_USERPOOLID,
        Username: this.username,
        // ...(Limit && { Limit }),
        // ...(NextToken && { NextToken }),
      })
      .promise();

    return groupsResult.Groups;
  }
}

export default CognitoUser;

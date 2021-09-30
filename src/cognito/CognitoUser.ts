import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognito = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

interface CognitoAttribute {
  [key: string]: string | boolean | number | undefined;
}

/**
 * User object
 */
class CognitoUser {
  sub: string;
  username?: string;
  userpoolId: string;
  attributes?: CognitoAttribute;
  groups: any;

  constructor({ sub, username, userpoolId }: { sub: string; username?: string; userpoolId: string }) {
    this.sub = sub;
    this.username = username;
    this.userpoolId = userpoolId;
  }

  /**
   * Get the user and return attributes
   */
  async getUser() {
    if (this.attributes) {
      return this.attributes;
    }

    const user = await cognito
      .adminGetUser({
        UserPoolId: this.userpoolId,
        Username: await this.getUsername(),
      })
      .promise();

    this.attributes = user.UserAttributes?.reduce((prev, cur) => {
      if (cur.Name) {
        prev[cur.Name] = this._modifyFieldValue(cur.Name, cur.Value);
      }
      return prev;
    }, {} as CognitoAttribute);

    return this.attributes;
  }

  _modifyFieldValue(key: string, value: string | boolean | number | undefined) {
    if (key === 'email_verified') {
      return value === 'true';
    }

    return value;
  }

  async getUsername(): Promise<string> {
    // Fetch username by sub
    if (!this.username) {
      const userResult = await cognito
        .listUsers({
          Filter: `sub = "${this.sub}"`,
          UserPoolId: this.userpoolId,
        })
        .promise();

      this.username = userResult?.Users?.[0]?.Username;
    }

    if (!this.username) {
      throw new Error('Could not find sub in Cognito ' + this.sub);
    }

    return this.username;
  }

  getSub() {
    return this.sub;
  }

  async getAttribute(key: string) {
    const user = await this.getUser();

    if (!user) {
      return undefined;
    }

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
        UserPoolId: this.userpoolId,
        Username: await this.getUsername(),
        // ...(Limit && { Limit }),
        // ...(NextToken && { NextToken }),
      })
      .promise();

    return groupsResult.Groups;
  }
}

export default CognitoUser;

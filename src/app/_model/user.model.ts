class Member {
    fname: string;
    lname: string;
}

export class User {
    name: string;
    username: string;
    password: string;
    members: Array<Member>;
}
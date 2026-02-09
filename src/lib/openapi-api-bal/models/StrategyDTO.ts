/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StrategyDTO = {
    type: StrategyDTO.type;
    pinCodeExpiration: string;
    remainingAttempts: number;
    createdAt: string;
};

export namespace StrategyDTO {

    export enum type {
        EMAIL = 'email',
        LOGIN_GOV = 'login_gov',
        INTERNAL = 'internal',
    }


}

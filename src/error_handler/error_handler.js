
class ErrorNames {
    static rateLimitApplyError = "Some error occured in server rate limiting.";
    static rateLimitResText = "User is rate limited for Some minutes .";
    static reposFetchResText ="Failed to fetch repositories in server now .";
    static reposFetchText = "Failed to fetch repositories internally.";
    static authCredentialCheckError = "Failed to authenticate user .";
    static rateLimitExceededText = "Rate limit exceeded";
    static authNotProvidedText="User is not authenticated . Provide authorization headers . ";
    static authNotProvidedError ="User authroization header required ."
    static authCredentialsFormatNot="User Authorization header has not supported format .";
    static authCredentialsFormatNotError="User Authorization header has incorrect format .";
    static authCredentialsNotCorrect ="User authorization credential provide are incorrect ."
    static authCredentialsNotCorrectText ="User authorization credential provided are incorrect ."
}

export {
    ErrorNames
}
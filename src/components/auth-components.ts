import styled from 'styled-components';

export const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 50px 0px;
    background-color: white;
`;
export const Title = styled.h1`
    font-size: 42px;
    color: black;
`;
export const Form = styled.form`
    margin-top: 50px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: max-content;
`;
export const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    width: 500px;
    margin-bottom: 10px;
    font-size: 16px;
    border: 1px solid black;
    text-align: center;
    &[type='submit'] {
        cursor: pointer;
        text-align: center;
        &:hover {
            color: #9bb4ff;
            opacity: 0.8;
        }
    }
`;
export const Error = styled.span`
    font-weight: 10;
    color: #ff6f61;
`;
export const Swithcer = styled.span`
    margin-top: 20px;
    color: black;
    a {
        color: #ffd09b;
        &:hover {
            color: #9bb4ff;
            opacity: 0.8;
        }
    }
`;
export const AgeSelector = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
`;

// Gender selection component
export const GenderSelector = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
`;

export const PetGenderSelector = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
`;

export const RadioLabel = styled.label`
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: black;
`;

export const RadioInput = styled.input`
    margin-right: 0px;
    margin-left: 10px;
    color: black;
`;

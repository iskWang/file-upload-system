import { css } from '@emotion/css'

export const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

export const formContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 400px;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  input {
    margin: 10px 0;
    width: 100%;
  }

  h1 {
    margin: 0 0 20px;
    font-size: 24px;
  }
`
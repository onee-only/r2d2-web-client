import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "../common";

interface UserInfo {
    id: string;
    username: string;
    profileURL: string;
    role: string;
}

interface Token {
    token: string;
}

export default function Login() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [info, setInfo] = useState<UserInfo>();
    const [code, setCode] = useState("");

    const getInfo = async () => {
        const data: AxiosResponse<UserInfo> = await axios.get(
            `http://${SERVER_HOST}/users/me`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );

        setInfo(data.data);
    };

    const onCodeSubmit = async () => {
        const data: AxiosResponse<Token> = await axios.post(
            `http://${SERVER_HOST}/auth/oauth/github`,
            {
                code: code,
            }
        );

        setToken(data.data.token);
        localStorage.setItem("token", data.data.token);
    };

    const onLoginClick = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23liaTsi2JJRRjfixb&redirect_uri=http://localhost:3000/callback?scope=read:user,user:email`;
    };

    useEffect(() => {
        if (token !== "") {
            getInfo();
        }
    }, [token]);

    return (
        <div>
            <div></div>
            {token === "" ? (
                <div>
                    <div>
                        <button onClick={onLoginClick}>Login</button>
                    </div>
                    <div>
                        <input
                            onChange={(e) => setCode(e.target.value)}
                            value={code}
                        ></input>
                        <button onClick={onCodeSubmit}>코드 제출</button>
                    </div>
                </div>
            ) : (
                <div>
                    <img src={info?.profileURL} alt="hi" height={50} />
                    <div>이름: {info?.username}</div>
                    <div>역할: {info?.role}</div>
                </div>
            )}
        </div>
    );
}

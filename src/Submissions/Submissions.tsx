import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "../common";

interface Submission {
    id: string;
    timestamp: string;
    sourceURL: string;
    isDone: boolean;
    user: User;
}

interface User {
    id: string;
    username: string;
    profileURL: string;
    role: string;
}

interface SubmissionOutput {
    id: string;
}

interface Timeline {
    kind: string;
    extra: string;
    timestamp: string;
}

export default function Submissions(data: { taskID: string }) {
    const [token] = useState(localStorage.getItem("token") || "");
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [timelines, setTimelines] = useState<Timeline[]>([]);

    const [curID, setCurID] = useState("");
    const [repository, setRepository] = useState("");
    const [commitHash, setCommitHash] = useState("");

    const onSubmitClick = async () => {
        const value: AxiosResponse<SubmissionOutput> = await axios.post(
            `http://${SERVER_HOST}/tasks/${data.taskID}/submissions`,
            {
                repository: repository,
                commitHash: commitHash,
            },
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        );

        setCurID(value.data.id);
    };

    useEffect(() => {
        if (curID === "") {
            axios
                .get<any, AxiosResponse<Submission[], any>>(
                    `http://${SERVER_HOST}/tasks/${data.taskID}/submissions?offset=0`
                )
                .then((data) => {
                    setSubmissions(data.data);
                });
            return;
        }

        axios
            .get<any, AxiosResponse<Timeline[], any>>(
                `http://${SERVER_HOST}/tasks/${data.taskID}/submissions/${curID}/events`
            )
            .then((data) => {
                setTimelines(data.data);
            });
    }, [data.taskID, curID]);

    return (
        <>
            <br />
            <br />

            {curID === "" ? (
                <>
                    <div>
                        <input
                            style={{ width: "300px" }}
                            placeholder="소스코드 레포지터리 (예: onee-only/go-git)"
                            value={repository}
                            onChange={(e) => setRepository(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            style={{ width: "300px" }}
                            placeholder="커밋 해시"
                            value={commitHash}
                            onChange={(e) => setCommitHash(e.target.value)}
                        />
                    </div>
                    <div>
                        <button onClick={onSubmitClick} disabled={token === ""}>
                            제출하기
                        </button>
                    </div>

                    <br />
                    <div>제출자 목록</div>

                    {submissions.map((submission) => (
                        <>
                            <br />
                            <div onClick={(e) => setCurID(e.currentTarget.innerText)}>
                                {submission.id}
                            </div>
                            <div>제출자</div>
                            <div>
                                <img src={submission.user.profileURL} alt="hi" />
                                <div>이름: {submission.user.username}</div>
                                <div>역할: {submission.user.role}</div>
                            </div>
                            <br />

                            <div>코드 저장소: {submission.sourceURL}</div>
                            <div>제출 시각: {submission.timestamp}</div>
                            <div>상태: {submission.isDone ? "작업 끝남" : "대기중"}</div>
                        </>
                    ))}
                </>
            ) : (
                <>
                    <button onClick={() => setCurID("")}>뒤로가기</button>
                    <div>제출 타임라인</div>
                    {timelines.map((timeline) => (
                        <>
                            <br />
                            <div>{timeline.timestamp}</div>
                            <div>{timeline.kind}</div>
                            <div>{timeline.extra}</div>
                        </>
                    ))}
                </>
            )}
        </>
    );
}

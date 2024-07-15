import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "../common";
import Resources from "../Resources/Resources";
import Sections from "../Sections/Sections";
import Submissions from "../Submissions/Submissions";

interface TaskElem {
    id: string;
    title: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    stage: string;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<TaskElem[]>([]);
    const [curID, setCurID] = useState("");
    const [curTask, setCurTask] = useState<Task>();

    useEffect(() => {
        if (curID === "") {
            axios
                .get<any, AxiosResponse<TaskElem[], any>>(`http://${SERVER_HOST}/tasks`)
                .then((data) => {
                    setTasks(data.data);
                });
            return;
        }

        axios
            .get<any, AxiosResponse<Task, any>>(`http://${SERVER_HOST}/tasks/${curID}`)
            .then((data) => {
                setCurTask(data.data);
            });
    }, [curID]);

    return (
        <>
            <br />
            <br />
            {curID === "" ? (
                <div>
                    <div>태스크 목록</div>
                    <ul>
                        {tasks.map((task) => (
                            <li>
                                <span
                                    onClick={(e) => setCurID(e.currentTarget.innerText)}
                                >
                                    {task.id}
                                </span>
                                <span>: {task.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <>
                    <button onClick={() => setCurID("")}>뒤로가기</button>
                    <div>제목: {curTask?.title}</div>
                    <div>설명: {curTask?.description}</div>
                    <div>상태: {curTask?.stage}</div>
                    <br />

                    <Resources taskID={curID} />
                    <Sections taskID={curID} />
                    <Submissions taskID={curID} />
                </>
            )}
        </>
    );
}

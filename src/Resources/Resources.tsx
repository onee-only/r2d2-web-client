import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "../common";

interface Resource {
    image: string;
    name: string;
    port: number;
    cpu: number;
    memory: number;
    isPrimary: boolean;
}

export default function Resources(data: { taskID: string }) {
    const [resources, setResources] = useState<Resource[]>([]);
    useEffect(() => {
        axios
            .get<any, AxiosResponse<Resource[], any>>(
                `http://${SERVER_HOST}/tasks/${data.taskID}/resources`
            )
            .then((data) => {
                setResources(data.data);
            });
    }, [data.taskID]);

    return (
        <>
            <br />
            <br />
            <div>준비된 자원들</div>
            {resources.map((resource) => (
                <>
                    <br />
                    {resource.isPrimary ? (
                        <div>
                            <b>사용자에게 제공되는 자원</b>
                        </div>
                    ) : (
                        <>
                            <div>호스트: {resource.name}</div>
                            <div>이미지: {resource.image}</div>
                        </>
                    )}
                    <div>포트: {resource.port}</div>
                    <div>cpu 할당량 (개): {resource.cpu}</div>
                    <div>메모리 할당량 (MB): {resource.memory / 1000 / 1000}</div>
                </>
            ))}
        </>
    );
}

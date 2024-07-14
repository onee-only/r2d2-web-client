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
    });

    return (
        <>
            <br />
            <br />
            <div>준비된 자원들</div>
            {resources.map((resource) => (
                <>
                    <br />
                    <div>호스트: {resource.name}</div>
                    <div>이미지: {resource.image}</div>
                    <div>포트: {resource.port}</div>
                    <div>cpu 할당량 (개): {resource.cpu}</div>
                    <div>메모리 할당량 (Byte): {resource.memory}</div>
                </>
            ))}
        </>
    );
}

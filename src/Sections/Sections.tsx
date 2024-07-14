import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { SERVER_HOST } from "../common";

interface Section {
    id: string;
    type: string;
    title: string;
    description: string;
    example: string;
    rpm: number;
}

export default function Sections(data: { taskID: string }) {
    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        axios
            .get<any, AxiosResponse<Section[], any>>(
                `http://${SERVER_HOST}/tasks/${data.taskID}/sections`
            )
            .then((data) => {
                setSections(data.data);
            });
    });

    return (
        <>
            <br />
            <br />
            <div>섹션 목록</div>
            {sections.map((section) => (
                <>
                    <br />
                    <div>제목: {section.title}</div>
                    <div>설명: {section.description}</div>
                    <div>타입: {section.type}</div>
                    {section.type === "LOAD" ? (
                        <div>분당 요청 수: {section.rpm}</div>
                    ) : (
                        <></>
                    )}
                    <div>예시</div>
                    <div>{section.example}</div>
                </>
            ))}
        </>
    );
}

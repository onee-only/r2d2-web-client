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

interface Example {
    input: Input;
    expected: Expected | Map<string, Template>;
}

interface Input {
    method: string;
    path: string;
    headers: any;
    body: string;
}

interface Expected {
    status: number;
    headers: any;
    body: string;
}

interface Template {
    headers: any;
    bodySchema: string;
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
    }, [data.taskID]);

    return (
        <>
            <br />
            <br />
            <div>섹션 목록</div>
            {sections.map((section) => {
                const examples =
                    section.example === ""
                        ? []
                        : (JSON.parse(section.example) as Example[]);
                // const examples: Example[] = [];
                return (
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
                        <br />
                        <div>예시 (HTTP 요청과 그에 따른 응답)</div>
                        <div>
                            {examples.map((example) => {
                                console.log(example);
                                const inputBody =
                                    example.input.body === undefined
                                        ? ""
                                        : JSON.stringify(
                                              JSON.parse(atob(example.input.body)),
                                              null,
                                              4
                                          );

                                let inputHeaders: string[] = [];

                                if (example.input.headers != null) {
                                    Object.entries(example.input.headers).forEach(
                                        ([key, value]) => {
                                            inputHeaders.push(`${key}: ${value}`);
                                        }
                                    );
                                }

                                let response: JSX.Element;
                                if (example.expected instanceof Map) {
                                    const entries = Array.from(
                                        example.expected.entries()
                                    );
                                    response = (
                                        <>
                                            {entries.map(([key, value]) => {
                                                let headers: string[] = [];
                                                if (value.headers != null) {
                                                    Object.entries(value.headers).forEach(
                                                        ([key, value]) => {
                                                            headers.push(
                                                                `${key}: ${value}`
                                                            );
                                                        }
                                                    );
                                                }

                                                const responseSchema =
                                                    value.bodySchema === undefined
                                                        ? ""
                                                        : JSON.stringify(
                                                              JSON.parse(
                                                                  atob(value.bodySchema)
                                                              ),
                                                              null,
                                                              4
                                                          );

                                                return (
                                                    <>
                                                        <div>status: {key}</div>
                                                        <div>header</div>
                                                        {headers.map((header) => (
                                                            <div>{header}</div>
                                                        ))}
                                                        <div>body schema</div>
                                                        <div>
                                                            <pre>{responseSchema}</pre>
                                                        </div>
                                                    </>
                                                );
                                            })}
                                        </>
                                    );
                                } else {
                                    let headers: string[] = [];
                                    if (example.expected.headers != null) {
                                        Object.entries(example.expected.headers).forEach(
                                            ([key, value]) => {
                                                headers.push(`${key}: ${value}`);
                                            }
                                        );
                                    }

                                    const res =
                                        example.expected.body === undefined
                                            ? ""
                                            : JSON.stringify(
                                                  JSON.parse(atob(example.expected.body)),
                                                  null,
                                                  4
                                              );

                                    response = (
                                        <>
                                            <div>status: {example.expected.status}</div>
                                            <div>header</div>
                                            {headers.map((header) => (
                                                <div>{header}</div>
                                            ))}
                                            <div>body</div>
                                            <div>
                                                <pre>{res}</pre>
                                            </div>
                                        </>
                                    );
                                }

                                return (
                                    <>
                                        <br />
                                        <br />
                                        <div>
                                            <div>요청</div>
                                            <div>
                                                {example.input.method}{" "}
                                                {example.input.path}
                                            </div>
                                            <div>header</div>
                                            {inputHeaders.map((header) => (
                                                <div>{header}</div>
                                            ))}
                                            <div>body</div>
                                            <div>
                                                <pre>{inputBody}</pre>
                                            </div>
                                        </div>
                                        <div>
                                            <br />
                                            <div>응답</div>
                                            {response}
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </>
                );
            })}
        </>
    );
}

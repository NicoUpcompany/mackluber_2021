import React, { useState } from "react";
import { Form, Input, Button, notification } from 'antd';

import { signInAdminApi } from '../../../api/user';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../utils/constants';

export default function DashboardLogin() {

    const [input, setInput] = useState({
        email: "",
    });

    const changeForm = e => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    const login = async () => {
        const result = await signInAdminApi(input);

        if (result.message) {
            notification["error"]({
                message: result.message
            });
        } else {
            const { accessToken, refreshToken } = result;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN, refreshToken);

            window.location.href = "/dashboard/admin";
        }
    };

    return (
        <div className="home">
            <div className="mid b">
            </div>
            <div className="mid w">
                <div className="center">
                    <Form id="formIngreso" name="formIngreso" onChange={changeForm} onFinish={login}>
                        <h3>Ingresar al panel administrativo</h3>
                        <p>Ingresa correo electrónico</p>
                        <div className="campo">
                            <label>Email</label>
                            <Form.Item>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                />
                            </Form.Item>
                        </div>
                        <div className="campo">
                            <Form.Item>
                                <Button className="btn" htmlType="submit">
                                    Entrar
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
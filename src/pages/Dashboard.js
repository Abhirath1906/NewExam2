import { Layout, Drawer, Menu, Divider, Card, List, Skeleton,Button } from "antd";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import { useAppContext } from "../context/AppContext";
const { Header, Content } = Layout;

export async function getServerSideProps() {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    return {
        props: {
            totalBooks: data.total,
        },
    };
}

export default function Dashboard({ totalBooks }) {
    const [Open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [randomBook, setRandomBook] = useState(null);
    const [Loading, setLoading] = useState(false)
    const [All, setAll] = useState(totalBooks)
    const { theme, toggleTheme } = useAppContext();
    useEffect(() => {
        async function fetchData() {
            try {

                const randomId = Math.floor(Math.random() * 30) + 1;
                const bookRes = await fetch(`https://dummyjson.com/products/${randomId}`);
                const bookData = await bookRes.json();
                setRandomBook(bookData);


                const catRes = await fetch("/api/categories");
                const catData = await catRes.json();


                setCategories(Array.isArray(catData) ? catData : []);
            } catch {
                console.error("Fetch error");
            }
        }

        fetchData();
    }, []);


    useEffect(() => {
        setLoading(true)

        const timer = setTimeout(() => {
            setAll(totalBooks)
            setLoading(false)
        }, 1200)

        return () => clearTimeout(timer)
    }, [totalBooks])
    useEffect(() => {
        setLoading(true)

        const timer = setTimeout(() => {
            setAll(totalBooks)
            setLoading(false)
        }, 1200)

        return () => clearTimeout(timer)
    }, [totalBooks])

    return (
        <>
            <Layout>

                <Drawer
                    open={Open}
                    onClose={() => setOpen(false)}
                    placement="left"
                    style={{ backgroundColor: "black", color: "white" }}
                >
                    <Menu mode="inline" style={{ borderRadius: "10px" }}>
                        <Menu.Item><Link href="/">Home</Link></Menu.Item>
                        <Menu.Item><Link href="/Dashboard">Dashboard</Link></Menu.Item>

                    </Menu>
                </Drawer>


                <Header style={{
                    backgroundColor: theme === "dark" ? "#020617" : "black",
                    color: "white",
                    transition: "0.4s",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                        <MenuOutlined
                            onClick={() => setOpen(true)}
                            style={{ fontSize: "30px", color: "white", marginTop: "-32px" }}
                        />
                        <p style={{ fontSize: "40px", fontWeight: "700" }}>TheExam</p>

                        <Button
                            onClick={toggleTheme}
                            style={{ marginLeft: "100px", marginTop: "-30px" }}
                        >
                            {theme === "dark" ? "Light" : "Dark"}
                        </Button>
                    </div>
                </Header>


                <Content style={{
                    padding: "50px", backgroundColor: theme === "dark" ? "#020617" : "white",
                    color: theme === "dark" ? "white" : "black",
                    transition: "0.4s",
                }}>
                    <p style={{ fontSize: "40px" }}>Dashboard</p>
                    <Divider />

                    <div
                        style={{
                            display: "flex",
                            gap: "170px",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >


                        {Loading ? (
                            <Card style={{ height: "250px", width: "250px" }}>
                                <Skeleton active paragraph={{ rows: 3 }} />
                            </Card>
                        ) : (
                            <Card title="Total Books" style={{ height: "250px", width: "250px" }}>
                                <p style={{ fontSize: "100px", textAlign: "center" }}>{All}</p>
                            </Card>
                        )}





                        <Card title="Random Book of the Day" style={{ width: 300 }}>
                            {randomBook ? (
                                <>
                                    <img
                                        src={randomBook.thumbnail}
                                        width={200}
                                        style={{ borderRadius: "10px" }}
                                        alt={randomBook.title}
                                    />
                                    <h3>{randomBook.title}</h3>
                                    <p>${randomBook.price}</p>
                                </>
                            ) : (
                                <Skeleton active paragraph={{ rows: 5 }} />
                            )}
                        </Card>
                    </div>


                    <div style={{ marginTop: "100px", display: "flex", justifyContent: "center" }}>
                        <Card title="Book Categories" style={{ width: 1000 }}>
                            <List
                                size="small"
                                dataSource={categories}
                                renderItem={(item) => (
                                    <List.Item>
                                        {item.name ?? item.slug}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>
                </Content>
            </Layout>
        </>
    );
}

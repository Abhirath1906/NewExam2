import { Layout, Drawer, Menu, Divider, Button, Skeleton, Modal, Input, message, } from "antd";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
const { Header, Content } = Layout;

export async function getServerSideProps({ params }) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default function BookDetail({ data }) {
  const [Open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [book, setBook] = useState([]);
  const router = useRouter();

    const { theme, toggleTheme } = useAppContext();

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Book",
      content: "Are you sure you want to delete this book?",
      onOk() {
        message.success("Delete Success")
        router.push("/");
      },
    });
  };



  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setBook(data)
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

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
            <Menu.Item>
              <Link href="/">Home</Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/Dashboard">Dashboard</Link>
            </Menu.Item>
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
              style={{
                fontSize: "30px",
                color: "white",
                marginTop: "-32px",
              }}
            />
            <p
              style={{
                backgroundColor: "black",
                color: "white",
                fontSize: "40px",
                fontWeight: "700",
              }}
            >
              TheExam
            </p>

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
          transition: "0.4s", height:"100vh"
        }}>
          <Button onClick={() => router.back()}>Back</Button>

          <Divider />


          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <div style={{ display: "flex", gap: "40px" }}>

              <img
                src={book.thumbnail}
                width={300}
                style={{ borderRadius: "10px" }}
              />

              <div>
                <h1>{book.title}</h1>
                <p>{book.description}</p>

                <p><b>Price:</b> ${book.price}</p>
                <p><b>Discount:</b> {book.discountPercentage}%</p>
                <p><b>Category:</b> {book.category}</p>
                <p><b>Rating:</b> {book.rating}</p>
                <p><b>Stock:</b> {book.stock}</p>
                <p><b>Brand:</b> {book.brand}</p>


                <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                  <Button type="primary" onClick={() => setOpenModal(true)}>
                    Edit Book
                  </Button>

                  <Button danger onClick={handleDelete}>
                    Delete Book
                  </Button>
                </div>
              </div>
            </div>
          )}


          <Modal
            title="Edit Book"
            open={openModal}
            onCancel={() => setOpenModal(false)}
            onOk={() => setOpenModal(false)}
          >
            <Input
              placeholder="Title"
              value={book.title}
              onChange={(e) =>
                setBook({ ...book, title: e.target.value })
              }
            />

            <Input
              style={{ marginTop: 10 }}
              placeholder="Price"
              value={book.price}
              onChange={(e) =>
                setBook({ ...book, price: e.target.value })
              }
            />
          </Modal>
        </Content>
      </Layout>
    </>
  );
}

import { Layout, Drawer, Menu, Divider, Table, Input, Select, Button, Skeleton } from "antd";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import { useAppContext } from "../context/AppContext";

const { Header, Content } = Layout;
const { Search } = Input;

export async function getServerSideProps() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();

  const catRes = await fetch("https://dummyjson.com/products/categories");
  const categories = await catRes.json();

  return {
    props: {
      data: data.products,
      categories,
    },
  };
}

export default function Books({ data, categories }) {
  const [Open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [Fill, setFill] = useState([]);

  
  const { theme, toggleTheme } = useAppContext();

  const filteredData = data.filter((item) => {
    const matchTitle = item.title.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchTitle && matchCategory;
  });

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setFill(filteredData);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchText, selectedCategory, data]);

  const exportToCSV = () => {
    if (!Fill.length) return;

    const headers = Object.keys(Fill[0]).join(",");
    const rows = Fill.map(item =>
      Object.values(item).map(val => `"${val}"`).join(",")
    );

    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "books-list.csv";
    link.click();
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link href={`/books/${record.id}`}>
          <Button type="primary">View Details</Button>
        </Link>
      ),
    },
  ];

  return (
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

      
      <Header
        style={{
          backgroundColor: theme === "dark" ? "#020617" : "black",
          color: "white",
          transition: "0.4s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <MenuOutlined
            onClick={() => setOpen(true)}
            style={{ fontSize: "30px", color: "white", marginTop: "-32px" }}
          />

          <p style={{ color: "white", fontSize: "40px", fontWeight: "700" }}>
            TheExam
          </p>

          <Button
            onClick={toggleTheme}
            style={{ marginLeft: "100px",marginTop:"-30px" }}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </Header>

   
      <Content
        style={{
          padding: "50px",
          backgroundColor: theme === "dark" ? "#020617" : "white",
          color: theme === "dark" ? "white" : "black",
          transition: "0.4s",
        }}
      >
        <p style={{ fontSize: "40px" }}>Book List</p>
        <Divider />

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <Search
            placeholder="Search by title..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />

          <Select
            placeholder="Filter by Category"
            allowClear
            style={{ width: 250 }}
            onChange={(value) => setSelectedCategory(value)}
            options={categories.map((cat) => ({
              label: cat.name,
              value: cat.slug,
            }))}
          />

          <Button type="primary" onClick={exportToCSV}>
            Export Books to CSV
          </Button>
        </div>

        {Loading ? (
          <Skeleton active paragraph={{ rows: 20 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={Fill}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        )}
      </Content>
    </Layout>
  );
}

import React, { useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Loader,
  Menu,
  Paper,
  Select,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconSearch, IconHistory, IconRefresh, IconExclamationCircle } from "@tabler/icons-react";

import { PartHistory } from "@/app/type";
import { UseHistory } from "../hooks/useHistory";

const PartHistoryTable = (props: any) => {
  let mobile = props.matches;
  const [search, setSearch] = useState("");
  const { data: History, isLoading, isError, refetch } = UseHistory();

  const [sortbyDate, setSortbyDate] = useState("desc");
  const [action, setAction] = useState("all");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredHistory = History?.filter((history: PartHistory) => {
    const searchFields = Object.values(history).join("").toLowerCase();
    return (
      searchFields.includes(search.toLowerCase()) &&
      (action === "all" || history.action === action)
    );
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (sortbyDate === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  const rows = filteredHistory?.map((history: PartHistory, index: number) => (
    <Table.Tr key={history._id}>
      <Table.Td ta="center">
       
        {new Date(history.createdAt).toLocaleString()}
      </Table.Td>
      <Table.Td ta="center">{history.user}</Table.Td>
      {history.action == "เบิกสินค้า" ? (
        <Table.Td ta="center" c={"red"} fw={700}>
          {history.action}
        </Table.Td>
      ) : (
        <Table.Td ta="center" c={"green"} fw={700}>
          {history.action}
        </Table.Td>
      )}
      <Table.Td ta="center">{history.partCode}</Table.Td>
      <Table.Td ta="center">{history.partName}</Table.Td>
      {history.action == "เบิกสินค้า" ? (
        <Table.Td ta="center" c={"red"} fw={700}>
          {history.amount}
        </Table.Td>
      ) : (
        <Table.Td ta="center" c={"green"} fw={700}>
          {history.amount}
        </Table.Td>
      )}
    </Table.Tr>
  ));

  const mobileRows = filteredHistory?.map((history: PartHistory) => (
    <Card withBorder padding="xs" key={history._id}>
      <Grid justify="center" align="center" gutter="4" columns={4} grow>
        <Grid.Col span={4}>
          <Text fw={700} size="md">
            {history.partName}
          </Text>
        </Grid.Col>

        <Grid.Col span={4}>
          <Group justify="space-between">
            <Text size="sm">
              <b>เวลา/วันที่ : </b>
              {new Date(history.createdAt).toLocaleString()}
            </Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            <b>รหัส : </b>
            {history.partCode}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            <b>ผู้ใช้ : </b>
            {history.user}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            {history.action == "เบิกสินค้า" ? (
              <Text c={"red"} fw={700}>
                {history.action}
              </Text>
            ) : (
              <Text c={"green"} fw={700}>
                {history.action}
              </Text>
            )}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            {history.action == "เบิกสินค้า" ? (
              <Text c={"red"} fw={700}>
                <b>จำนวน : </b>
                {history.amount}
              </Text>
            ) : (
              <Text c={"green"} fw={700}>
                <b>จำนวน : </b>
                {history.amount}
              </Text>
            )}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  ));

  return (
    <Stack align="stretch" justify="center" gap="md">
      {mobile ? (
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconHistory size={30} />
              <Text size="xl" fw={700}>
                ประวัติการเบิก - เติมอะไหล่
              </Text>
            </Group>
            <Tooltip label="รีเฟรชข้อมูล">
              <ActionIcon
                variant="filled"
                color="blue"
                onClick={() => {
                  refetch();
                }}
                size="lg"
              >
                <IconRefresh />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group mt={-10} grow>
            <TextInput
              label="ค้นหาทุกข้อมูล"
              placeholder="ค้นหาทุกข้อมูล"
              leftSection={
                <IconSearch
                  style={{ width: "1rem", height: "1rem" }}
                  stroke={1.5}
                />
              }
              value={search}
              onChange={handleSearchChange}
            />
            <Select
              placeholder="เลือกการกระทำ"
              data={[
                { label: "ทั้งหมด", value: "all" },
                { label: "เติมสินค้า", value: "เติมสินค้า" },
                { label: "เบิกสินค้า", value: "เบิกสินค้า" },
              ]}
              label="เลือกการกระทำ"
              defaultValue={"all"}
              onChange={(value) => setAction(value as string)}
              searchable
            />
            <Select
              placeholder="เลือกเรียงตามวันที่ / เวลา"
              data={[
                { label: "ใหม่ไปเก่า", value: "desc" },
                { label: "เก่าไปใหม่", value: "asc" },
              ]}
              label="เลือกเรียงตามวันที่ / เวลา"
              defaultValue={"desc"}
              onChange={(value) => setSortbyDate(value as string)}
            />
            <Text>&nbsp;</Text>
          </Group>

          {isLoading ? (
            <>
              <Center mt={"8%"}>
                <Loader color="green" size={"xl"} />
              </Center>
              <Center>
                <Space h="md" />
                <Text fw={700}>กำลังโหลดข้อมูล</Text>
              </Center>
            </>
          ) : isError ? (
            <>
              <Center mt={"8%"}>
                <IconExclamationCircle size={50} color="red" />
              </Center>
              <Center>
                <Text fw={700}>เกิดข้อผิดพลาดในการเรียกข้อมูล</Text>
              </Center>

              <Center>
                <Button variant="filled" radius="md" onClick={() => refetch()}>
                  ลองอีกครั้ง
                </Button>
              </Center>
            </>
          ) : (
            <Paper shadow="sm" radius="md" p={"sm"} withBorder>
              <Table
                highlightOnHover
                stickyHeader
                striped
                stickyHeaderOffset={55}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th ta="center">วันที่ / เวลา</Table.Th>
                    <Table.Th ta="center">ผู้ใช้</Table.Th>
                    <Table.Th ta="center">การกระทำ</Table.Th>
                    <Table.Th ta="center">รหัสอะไหล่</Table.Th>
                    <Table.Th ta="center">ชื่ออะไหล่</Table.Th>
                    <Table.Th ta="center">จำนวน</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Paper>
          )}
        </>
      ) : (
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconHistory size={30} />
              <Text size="lg" fw={700}>
                ประวัติการเบิก - เติมอะไหล่
              </Text>
            </Group>
            <Tooltip label="รีเฟรชข้อมูล">
              <ActionIcon
                variant="filled"
                color="blue"
                onClick={() => {
                  refetch();
                }}
                size="1.855rem"
              >
                <IconRefresh size={"1.3rem"} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Group mt={-10} grow align="center">
            <TextInput
              label="ค้นหาทุกข้อมูล"
              placeholder="ค้นหาทุกข้อมูล"
              leftSection={
                <IconSearch
                  style={{ width: "1rem", height: "1rem" }}
                  stroke={1.5}
                />
              }
              value={search}
              onChange={handleSearchChange}
            />
            <Select
              placeholder="เลือกการกระทำ"
              data={[
                { label: "ทั้งหมด", value: "all" },
                { label: "เติมสินค้า", value: "เติมสินค้า" },
                { label: "เบิกสินค้า", value: "เบิกสินค้า" },
              ]}
              label="เลือกการกระทำ"
              defaultValue={"all"}
              onChange={(value) => setAction(value as string)}
              searchable
            />
          </Group>
          <Group mt={-10} grow align="center">
            <Select
              placeholder="เลือกเรียงตามวันที่ / เวลา"
              data={[
                { label: "ใหม่ไปเก่า", value: "desc" },
                { label: "เก่าไปใหม่", value: "asc" },
              ]}
              label="เลือกเรียงตามวันที่ / เวลา"
              defaultValue={"desc"}
              onChange={(value) => setSortbyDate(value as string)}
            />
            <Text>&nbsp;</Text>
          </Group>
          {isLoading ? (
            <>
              <Center mt={"30%"}>
                <Loader color="green" size={"xl"} />
              </Center>
              <Center>
                <Space h="md" />
                <Text fw={700}>กำลังโหลดข้อมูล</Text>
              </Center>
            </>
          ) : isError ? (
            <>
              <Center mt={"30%"}>
                <IconExclamationCircle size={50} color="red" />
              </Center>
              <Center>
                <Text fw={700}>เกิดข้อผิดพลาดในการเรียกข้อมูล</Text>
              </Center>

              <Center>
                <Button variant="filled" radius="md" onClick={() => refetch()}>
                  ลองอีกครั้ง
                </Button>
              </Center>
            </>
          ) : (
            <Stack gap={"xs"}> {mobileRows}</Stack>
          )}
        </>
      )}
    </Stack>
  );
};

export default PartHistoryTable;

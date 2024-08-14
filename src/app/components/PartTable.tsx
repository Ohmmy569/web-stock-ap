import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Loader,
  Menu,
  NumberFormatter,
  Paper,
  rem,
  Select,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconEngine,
  IconPackageExport,
  IconPackageImport,
  IconPlus,
  IconRefresh,
  IconDotsVertical,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { Part, Car, PartType } from "../type";
import { useSession } from "next-auth/react";

import { useDisclosure } from "@mantine/hooks";

import AddPartModal from "@components/PartModal/AddPartModal";
import EditPartModal from "@components/PartModal/EditPartModal";
import RestockPartModal from "@components/PartModal/RestockPart";
import OutStockPartModal from "./PartModal/OutStockPart";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import { UsePart } from "../hooks/usePart";
import { UsePartType } from "../hooks/useType";
import { UseBrandCar } from "../hooks/useBrand";
import { UseCar } from "../hooks/useCar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const PartTable = (props: any) => {
  let mobile = props.matches;

  const [PartCode, setPartCode] = useState([] as any[] | undefined);

  const [search, setSearch] = useState("");

  const [editPart, setEditPart] = useState<Part>({} as Part);
  const [brand, setBrand] = useState("all");
  const [typeofparts, setTypeofparts] = useState("all");
  const [EditPartName, setEditPartName] = useState([] as any[] | undefined);
  const [EditPartCode, setEditPartCode] = useState([] as any[] | undefined);
  const [EditCode, setEditCode] = useState("");
  const [PickBrand, setPickBrand] = useState("");

  const [RestockPart, setRestockPart] = useState<Part>({} as Part);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const [Restockopened, { open: openRestock, close: closeRestock }] =
    useDisclosure(false);
  const [OutStockopened, { open: openOutStock, close: closeOutStock }] =
    useDisclosure(false);

  const { data: session, status } = useSession();
  const UserEmail = session?.user?.email;
  const name = UserEmail?.split("@")[0];

  const [checked, setChecked] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const {
    data: Parts,
    isLoading: PartLoading,
    isError: PartError,
    refetch: fetchPart,
  } = UsePart();
  const {
    data: TypeParts,
    isLoading: TypeLoading,
    isError: TypeError,
    refetch: fetchType,
  } = UsePartType();
  const {
    data: CarBrand,
    isLoading: BrandLoading,
    isError: BrandError,
    refetch: fetchBrand,
  } = UseBrandCar();
  const {
    data: Cars,
    isLoading: CarLoading,
    isError: CarError,
    refetch: fetchCar,
  } = UseCar();

  const ModalCars = Cars;
  const modalPartName = Parts?.map((Part: Part) => Part.name) as string[];

  const selectType = [{ label: "ทั้งหมด", value: "all" }];
  const selectBrand = [{ label: "ทั้งหมด", value: "all" }];
  const modalSelectType = [] as string[];
  const modalSelectBrand = [] as string[];

  if (CarBrand && TypeParts) {
    const ModalcarBrand = CarBrand.map((Brand: any) => Brand.brand) as string[];
    const ModalTypeofParts = TypeParts.map(
      (Type: any) => Type.name
    ) as string[];

    ModalcarBrand.map((brand) => {
      selectBrand.push({ label: brand, value: brand });
      modalSelectBrand.push(brand);
    });
    ModalTypeofParts.map((type) => {
      selectType.push({ label: type, value: type });
      modalSelectType.push(type);
    });
  }

  const modalCode = PartCode;
  let modalEditPartName = Parts?.map((Part: Part) => Part.name) as string[];
  let modalEditPartCode = Parts?.map((Part: Part) => Part.code) as string[];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredParts = Parts?.filter((Part: Part) => {
    const searchFields = Object.values(Part).join("").toLowerCase();

    return (
      searchFields.includes(search.toLowerCase()) &&
      (brand === "all" || Part.brand === brand) &&
      (typeofparts === "all" || Part.type === typeofparts) &&
      (checked ? Part.amount === 0 : true) &&
      (checkedIn ? Part.amount > 0 : true)
    );
  });

  function OpenEdit(Part: Part) {
    setEditPart(Part);
    setEditCode(Part.code);
    setEditPartName(modalEditPartName.filter((name) => name !== Part.name));
    setEditPartCode(modalEditPartCode.filter((code) => code !== Part.code));
    setPickBrand(Part.brand);
    openEdit();
  }

  function OpenRestock(Part: Part) {
    setRestockPart(Part);
    openRestock();
  }

  function OpenOutStock(Part: Part) {
    setRestockPart(Part);
    openOutStock();
  }

  const [delPart , setDelPart] = useState<Part>({} as Part);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: any) => {
      await axios.delete(`/api/parts/${id}`);
    },
    onSuccess: () => {
      showNotification({
        title: "ลบรายการอ่ะไหล่สำเร็จ",
        message: "ลบรายการ "+ delPart + " แล้ว",
        color: "blue",
      });
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
    onError: () => {
      showNotification({
        title: "ลบรายการอ่ะไหล่ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดในการลบรายการอ่ะไหล่",
        color: "red",
      });
    },
  });

  const openDeleteModal = (PartId: any, Partname: any) => {
    modals.openConfirmModal({
      title: <Text fw={900}> ลบรายการอ่ะไหล่ </Text>,
      centered: true,
      children: (
        <Text size="sm">
          ต้องการลบอ่ะไหล่ <strong> {Partname}</strong> ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => onclose,
      onConfirm: () => {
        removePart(PartId, Partname);
        onclose;
      },
    });
  };

  async function removePart(PartId: any, Partname: any) {
    setDelPart(Partname);
    deleteMutation.mutate(PartId);
  }

  const rows = filteredParts?.map((Part: Part) => (
    <Table.Tr key={Part._id}>
      <Table.Td ta="center" align="center">
        {Part.code}
      </Table.Td>
      <Table.Td ta="center" align="center">
        {Part.name}
      </Table.Td>
      <Table.Td ta="center" align="center">
        {Part.type}
      </Table.Td>

      <Table.Td ta="center" align="center">
        {Part.brand}
      </Table.Td>
      <Table.Td ta="center" align="center">
        {Part.model}
      </Table.Td>
      <Table.Td ta="center" align="center">
        <NumberFormatter thousandSeparator suffix=" ฿" value={Part.costPrice} />
      </Table.Td>
      <Table.Td ta="center" align="center">
        <NumberFormatter thousandSeparator suffix=" ฿" value={Part.sellPrice} />
      </Table.Td>

      {Part.amount === 0 ? (
        <Table.Td ta="center" align="center" c="red.9" fw={700}>
          {Part.amount}
        </Table.Td>
      ) : (
        <Table.Td ta="center" align="center" c="green.9" fw={700}>
          {Part.amount}
        </Table.Td>
      )}

      <Table.Td ta="center" align="center">
        <Group gap={"xs"}>
          <Tooltip label="แก้ไข">
            <ActionIcon
              variant="filled"
              color="yellow.8"
              onClick={() => OpenEdit(Part)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="ลบ">
            <ActionIcon
              variant="filled"
              color="red.8"
              onClick={() =>
                openDeleteModal(Part._id, Part.code + " " + Part.name)
              }
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="เติมสินค้า">
            <ActionIcon
              variant="filled"
              color="teal"
              onClick={() => OpenRestock(Part)}
            >
              <IconPackageImport />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="เบิกสินค้า">
            <ActionIcon
              variant="filled"
              color="blue.8"
              onClick={() => OpenOutStock(Part)}
              disabled={Part.amount === 0}
            >
              <IconPackageExport />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const mobileRows = filteredParts?.map((Part: Part) => (
    <Card withBorder padding="xs" key={Part._id}>
      <Grid justify="center" align="center" gutter="4" columns={4}>
        <Grid.Col span={4}>
          <Group justify="space-between">
            <Text fw={700} size="md">
              {Part.name}
            </Text>

            <Menu shadow="md" position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon variant="subtle" color="blue" size="sm">
                  <IconDotsVertical stroke={3} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconEdit style={{ width: rem(14), height: rem(14) }} />
                  }
                  color="yellow.9"
                  onClick={() => OpenEdit(Part)}
                >
                  แก้ไข
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  color="red.9"
                  onClick={() =>
                    openDeleteModal(Part._id, Part.code + " " + Part.name)
                  }
                >
                  ลบ
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconPackageImport
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  color="teal"
                  onClick={() => OpenRestock(Part)}
                >
                  เติมอ่ะไหล่
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconPackageExport
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  color="blue.9"
                  onClick={() => OpenOutStock(Part)}
                  disabled={Part.amount === 0}
                >
                  เบิกอ่ะไหล่
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            <b>รหัส : </b>
            {Part.code}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            <b>ประเภท : </b>
            {Part.type}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            <b>ยี่ห้อ : </b>
            {Part.brand}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            <b>รุ่น : </b>
            {Part.model}
          </Text>
        </Grid.Col>

        <Grid.Col span={2}>
          <Text size="sm">
            <b>ราคาทุน : </b>
            <NumberFormatter
              thousandSeparator
              suffix=" ฿"
              value={Part.costPrice}
            />
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text size="sm">
            <b>ราคาขาย : </b>
            <NumberFormatter
              thousandSeparator
              suffix=" ฿"
              value={Part.sellPrice}
            />
          </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          {Part.amount === 0 ? (
            <Text size="sm" c="red.9" fw={700}>
              <b>จำนวณ : </b>
              {Part.amount}
            </Text>
          ) : (
            <Text size="sm" c="green.9" fw={700}>
              <b>จำนวณ : </b>
              {Part.amount}
            </Text>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  ));

  let isLoading = PartLoading || TypeLoading || BrandLoading || CarLoading;
  let isError = PartError || TypeError || BrandError || CarError;
  const refetch = () => {
    fetchPart();
    fetchType();
    fetchBrand();
    fetchCar();
  };

  return (
    <Stack align="stretch" justify="center" gap="md">
      {mobile ? (
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconEngine size={30} />
              <Text size="xl" fw={700}>
                อ่ะไหล่รถยนต์
              </Text>
            </Group>
            <Group gap={"xs"}>
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
              <Tooltip label="เพิ่มอะไหล่ใหม่">
                <Button
                  variant="filled"
                  color="green"
                  radius="md"
                  leftSection={<IconPlus size={20} stroke={2.5} />}
                  onClick={() => openAdd()}
                >
                  เพิ่มอะไหล่ใหม่
                </Button>
              </Tooltip>
            </Group>
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
              placeholder="เลือกประเภท"
              label="เลือกประเภท"
              data={selectType}
              defaultValue={"all"}
              onChange={(value) => setTypeofparts(value as string)}
              searchable
            />
            <Select
              placeholder="เลือกยี่ห้อรถยนต์"
              data={selectBrand}
              label="เลือกยี่ห้อรถยนต์"
              defaultValue={"all"}
              onChange={(value) => setBrand(value as string)}
              searchable
            />
            <Select
              placeholder="เลือกสถานะ"
              data={[
                { label: "ทั้งหมด", value: "all" },
                { label: "อ่ะไหล่ที่หมด", value: "0" },
                { label: "อ่ะไหล่ที่คงเหลือ", value: "1" },
              ]}
              label="เลือกสถานะ"
              defaultValue={"all"}
              onChange={(value) => {
                if (value === "0") {
                  setChecked(true);
                  setCheckedIn(false);
                } else if (value === "1") {
                  setChecked(false);
                  setCheckedIn(true);
                } else {
                  setChecked(false);
                  setCheckedIn(false);
                }
              }}
              searchable
            />
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
                    <Table.Th ta="center">รหัสบาร์โค๊ด</Table.Th>
                    <Table.Th ta="center">ชื่อ</Table.Th>
                    <Table.Th ta="center">ประเภท</Table.Th>
                    <Table.Th ta="center">ยี่ห้อรถยนต์</Table.Th>
                    <Table.Th ta="center">รุ่นรถยนต์</Table.Th>
                    <Table.Th ta="center">ราคาทุน</Table.Th>
                    <Table.Th ta="center">ราคาขาย</Table.Th>
                    <Table.Th ta="center">จำนวณ</Table.Th>
                    <Table.Th ta="center"> </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Paper>
          )}
        </>
      ) : (
        //------------------------------------------ mobile -------------------------------------------------------
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconEngine size={30} />
              <Text size="lg" fw={700}>
                อ่ะไหล่รถยนต์
              </Text>
            </Group>
            <Group gap={"xs"} align="center">
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
              <Tooltip label="เพิ่มอะไหล่ใหม่">
                <Button
                  size="xs"
                  variant="filled"
                  color="green"
                  radius="md"
                  leftSection={<IconPlus size={20} stroke={2.5} />}
                  onClick={() => openAdd()}
                >
                  เพิ่มอะไหล่ใหม่
                </Button>
              </Tooltip>
            </Group>
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
              placeholder="เลือกประเภท"
              label="เลือกประเภท"
              data={selectType}
              defaultValue={"all"}
              onChange={(value) => setTypeofparts(value as string)}
              searchable
            />
          </Group>
          <Group mt={-10} grow align="center">
            <Select
              placeholder="เลือกยี่ห้อรถยนต์"
              data={selectBrand}
              label="เลือกยี่ห้อรถยนต์"
              defaultValue={"all"}
              onChange={(value) => setBrand(value as string)}
              searchable
            />
            <Select
              placeholder="เลือกสถานะ"
              data={[
                { label: "ทั้งหมด", value: "all" },
                { label: "อ่ะไหล่ที่หมด", value: "0" },
                { label: "อ่ะไหล่ที่คงเหลือ", value: "1" },
              ]}
              label="เลือกสถานะ"
              defaultValue={"all"}
              onChange={(value) => {
                if (value === "0") {
                  setChecked(true);
                  setCheckedIn(false);
                } else if (value === "1") {
                  setChecked(false);
                  setCheckedIn(true);
                } else {
                  setChecked(false);
                  setCheckedIn(false);
                }
              }}
              searchable
            />
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

      <AddPartModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มรายการอะไหล่ใหม่ </Text>}
        partName={modalPartName}
        typeofPart={modalSelectType}
        carBrand={modalSelectBrand}
        Cars={ModalCars}
        Code={modalCode}
        parts={Parts as Part[]}
      />

      <EditPartModal
        opened={Editopened}
        onClose={closeEdit}
        title={
          <Text fw={900}>
            {" "}
            แก้ไขอ่ะไหล่ <strong>{EditCode}</strong>{" "}
          </Text>
        }
        parts={Parts as Part[]}
        EditPart={editPart}
        partName={EditPartName}
        partCode={EditPartCode}
        typeofPart={modalSelectType}
        carBrand={modalSelectBrand}
        Cars={ModalCars}
      />
      
      <RestockPartModal
        opened={Restockopened}
        onClose={closeRestock}
        title={<Text fw={900}> เติมสินค้า {RestockPart.name} </Text>}
        Part={RestockPart}
        username={name as string}
    
      />
      <OutStockPartModal
        opened={OutStockopened}
        onClose={closeOutStock}
        title={<Text fw={900}> เบิกสินค้า {RestockPart.name} </Text>}
        Part={RestockPart}
        username={name as string}
   
      />
    </Stack>
  );
};

export default PartTable;

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
  Paper,
  rem,
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
  IconPlus,
  IconRefresh,
  IconBrandToyota,
  IconDotsVertical,
  IconExclamationCircle,
} from "@tabler/icons-react";

import { useDisclosure } from "@mantine/hooks";

import AddBrandCarModal from "./BrandCarModal/AddBrandCar";
import EditBrandCarModal from "./BrandCarModal/EditBrandCar";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { CarBrand } from "@/app/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseBrandCar } from "../hooks/useBrand";
import axios from "axios";

const BrandTable = (props: any) => {
  let mobile = props.matches;

  const [BrandName, setBrandName] = useState([] as any[] | undefined);

  const [search, setSearch] = useState("");
  const [editCarBrand, setEditCarBrand] = useState({} as CarBrand);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const { data: CarBrand, isLoading, isError, refetch } = UseBrandCar();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredParts = CarBrand?.filter((CarBrand: CarBrand) => {
    return CarBrand.brand.toLowerCase().includes(search.toLowerCase());
  });

  function OpenEdit(CarBrandIN: CarBrand) {
    setEditCarBrand(CarBrandIN);
    setBrandName(
      CarBrand?.filter((carBrand) => carBrand.brand !== CarBrandIN.brand)
    );
    openEdit();
  }

  function OpenAdd() {
    setBrandName(CarBrand?.map((CarBrand: CarBrand) => CarBrand.brand) || []);
    openAdd();
  }

  const [delName , setDelName] = useState("");
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: any) => {
      await axios.delete(`/api/brandcar/${id}`);
    },
    onSuccess: () => {
      showNotification({
        title: "ลบยี่ห้อรถยนต์สำเร็จ",
        message: "ลบยี่ห้อ " + delName + " เรียบร้อย",
        color: "blue",
      });
      queryClient.invalidateQueries({ queryKey: ["brandcars"] });
    },
    onError: () => {
      showNotification({
        title: "ลบยี่ห้อรถยนต์ไม่สำเร็จ",
        message: "ลบยี่ห้อรถยนต์ไม่สำเร็จ",
        color: "red",
      });
    },
  });

  const openDeleteModal = (CarBrandId: any, Partname: any) => {
    modals.openConfirmModal({
      title: <Text fw={900}>ลบยี่ห้อรถยนต์</Text>,
      centered: true,
      children: (
        <Text size="sm">
          ต้องการลบ <strong> {Partname}</strong> ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => onclose,
      onConfirm: () => {
        removePart(CarBrandId, Partname);
        onclose;
      },
    });
  };

  async function removePart(CarBrandId: any, CarBrandname: any) {
    setDelName(CarBrandname);
    deleteMutation.mutate(CarBrandId);
  }

  const rows = filteredParts?.map((CarBrand: CarBrand, index: number) => (
    <Table.Tr key={CarBrand._id}>
      <Table.Td ta="center">{index + 1}</Table.Td>
      <Table.Td ta="center">{CarBrand.brand}</Table.Td>
      <Table.Td ta="center">
        <Group gap={"xs"}>
          <Tooltip label="แก้ไข">
            <ActionIcon
              variant="filled"
              color="yellow.8"
              onClick={() => OpenEdit(CarBrand)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="ลบ">
            <ActionIcon
              variant="filled"
              color="red.8"
              onClick={() => openDeleteModal(CarBrand._id, CarBrand.brand)}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const mobileRows = filteredParts?.map((CarBrand: CarBrand, index: number) => (
    <Card withBorder padding="xs" key={CarBrand._id}>
      <Grid justify="center" align="center" gutter="4" columns={4}>
        <Grid.Col span={4}>
          <Group justify="space-between">
            <Text fw={700} size="md">
              {index + 1}.
            </Text>
            <Text fw={700} size="md">
              {CarBrand.brand}
            </Text>
            <Group gap={"xs"}>
              <Tooltip label="แก้ไข">
                <ActionIcon
                  variant="filled"
                  color="yellow.8"
                  onClick={() => OpenEdit(CarBrand)}
                >
                  <IconEdit />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="ลบ">
                <ActionIcon
                  variant="filled"
                  color="red.8"
                  onClick={() => openDeleteModal(CarBrand._id, CarBrand.brand)}
                >
                  <IconTrash />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
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
              <IconBrandToyota size={30} />
              <Text size="xl" fw={700}>
                ยี่ห้อรถยนต์
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
              <Tooltip label="เพิ่มยี่ห้อรถยนต์">
                <Button
                  variant="filled"
                  color="green"
                  radius="md"
                  leftSection={<IconPlus size={20} stroke={2.5} />}
                  onClick={() => OpenAdd()}
                >
                  เพิ่มยี่ห้อรถยนต์
                </Button>
              </Tooltip>
            </Group>
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
            <>
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
                <Text>&nbsp;</Text>
                <Text>&nbsp;</Text>
                <Text>&nbsp;</Text>
              </Group>
              <Paper shadow="sm" radius="md" p={"sm"} withBorder>
                <Table
                  highlightOnHover
                  stickyHeader
                  striped
                  stickyHeaderOffset={55}
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th ta="center">ลำดับ</Table.Th>
                      <Table.Th ta="center">ชื่อยี่ห้อรถยนต์</Table.Th>

                      <Table.Th ta="center"> </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </Paper>
            </>
          )}
        </>
      ) : (
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconBrandToyota size={30} />
              <Text size="lg" fw={700}>
                ยี่ห้อรถยนต์
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
                  size="1.855rem"
                >
                  <IconRefresh size={"1.3rem"} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="เพิ่มยี่ห้อรถยนต์">
                <Button
                  size="xs"
                  variant="filled"
                  color="green"
                  radius="md"
                  leftSection={<IconPlus size={20} stroke={2.5} />}
                  onClick={() => OpenAdd()}
                >
                  เพิ่มยี่ห้อรถยนต์
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

      <AddBrandCarModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}>เพิ่มยี่ห้อรถยนต์</Text>}
        BrandCarName={BrandName}
      />

      <EditBrandCarModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> เพิ่มประเภทอะไหล่ </Text>}
        BrandCarName={BrandName}
        BrandCar={editCarBrand}
      />
    </Stack>
  );
};

export default BrandTable;

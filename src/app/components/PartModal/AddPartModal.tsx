"use client";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
  MultiSelect,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

import { Car, Part } from "@/app/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  partName: string[];
  typeofPart: string[];
  carBrand: string[];
  Cars: Car[] | undefined;
  Code: string[] | undefined;
  parts: Part[];
}

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const AddPartModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  partName,
  typeofPart,
  carBrand,
  Cars,
  Code,
}) => {
  const [CarModel, setCarModel] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const PartName = partName || [];
  const CodeName = Code || [];
  const CarBrand = carBrand || [];
  const TypeofPart = typeofPart || [];
  //remove 0 index
  CarBrand.shift();
  TypeofPart.shift();

  const schema = z.object({
    code: z
      .string()
      .nonempty({ message: "กรุณากรอกรหัสอ่ะไหล่" })
      .refine(
        (value) => {
          if (CodeName.includes(value)) {
            return false; // Invalid if the code already exists in CodeName
          }
          return true; // Valid if the code doesn't exist in CodeName
        },
        { message: "รหัสอ่ะไหล่ซ้ำ" }
      ),
    name: z
      .string()
      .nonempty({ message: "กรุณากรอกชื่ออ่ะไหล่" })
      .refine(
        (value) => {
          if (PartName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "ชื่ออ่ะไหล่ซ้ำ" }
      ),
    typeofPart: z.string().nonempty({ message: "กรุณาเลือกประเภทอ่ะไหล่" }),
    brand: z.string().nonempty({ message: "กรุณาเลือกยี่ห้อรถยนต์" }),
    model: z.array(z.string()).nonempty({ message: "กรุณาเลือกรุ่นรถยนต์" }),
    costPrice: z.number().min(0, { message: "กรุณากรอกราคาทุน" }),
    salePrice: z.number().min(0, { message: "กรุณากรอกราคาขาย" }),
  });

  const form = useForm({
    initialValues: {
      code: "",
      name: "",
      typeofPart: "",
      brand: "",
      model: [],
      costPrice: "",
      salePrice: "",
    },
    validate: zodResolver(schema),
  });

  const [Scode, setScode] = useState("");
  const [Sname, setSname] = useState("");
  const [StypeofPart, setStypeofPart] = useState("");
  const [Sbrand, setSbrand] = useState("");
  const [Smodel, setSmodel] = useState("");
  const [ScostPrice, setScostPrice] = useState(0);
  const [SsalePrice, setSsalePrice] = useState(0);

  useEffect(() => {
    if (selectedBrand) {
      const filteredModels =
        Cars?.filter((car) => car.brand === selectedBrand).map(
          (car) => car.name
        ) || [];

      setCarModel(removeDuplicates(["ใช้ได้ทุกรุ่น", ...filteredModels]));
    } else {
      setCarModel([]);
    }
  }, [selectedBrand, Cars]);

  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/parts", {
        code: Scode,
        name: Sname,
        type: StypeofPart,
        brand: Sbrand,
        model: Smodel,
        costPrice: ScostPrice,
        sellPrice: SsalePrice,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      showNotification({
        title: "เพิ่มอ่ะไหล่สำเร็จ",
        message: "เพิ่มอ่ะไหล่ " + Sname  +  " เรียบร้อย",
        color: "green",
        icon: null,
      });
    },
    onError: () => {
      showNotification({
        title: "เพิ่มอ่ไหล่ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มอ่ะไหล่",
        color: "red",
        icon: null,
      });
    },
  });

  const handlesubmit = async (data: any) => {
    let model = "";
    if (data.model.length > 1) {
      model = data.model.join(" , ");
    } else {
      model = data.model[0];
    }

    setScode(data.code);
    setSname(data.name);
    setStypeofPart(data.typeofPart);
    setSbrand(data.brand);
    setSmodel(model);
    setScostPrice(data.costPrice);
    setSsalePrice(data.salePrice);
    addMutation.mutate();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data);
            onClose();
            form.reset();
          })();
        }}
      >
        <Box>
          <TextInput
            label="รหัสอ่ะไหล่"
            placeholder="กรอกรหัสอ่ะไหล่"
            mb={"xs"}
            {...form.getInputProps("code")}
          />
          <TextInput
            label="ชื่ออ่ะไหล่"
            placeholder="กรอกชื่ออ่ะไหล่"
            mb={"xs"}
            {...form.getInputProps("name")}
          />
          <Select
            label="ประเภทอ่ะไหล่"
            placeholder="เลือกประเภทอ่ะไหล่"
            data={typeofPart}
            mb={"xs"}
            {...form.getInputProps("typeofPart")}
            searchable
          />

          <Select
            placeholder="เลือกยี่ห้อรถยนต์"
            data={carBrand}
            label="เลือกยี่ห้อรถยนต์"
            {...form.getInputProps("brand")}
            onChange={(value) => {
              form.setFieldValue("model", []);
              setSelectedBrand(value as string);
              form.setFieldValue("brand", value as string);
            }}
            mb={"xs"}
            searchable
          />
          <MultiSelect
            label="รุ่นรถยนต์"
            mb={"xs"}
            placeholder="เลือกรุ่นรถยนต์"
            data={[
              ...CarModel.map((model) => ({ label: model, value: model })),
            ]}
            {...form.getInputProps("model")}
            searchable
          />
          <NumberInput
            label="ราคาทุน"
            placeholder="กรอกราคาทุน"
            mb={"xs"}
            {...form.getInputProps("costPrice")}
          />
          <NumberInput
            label="ราคาขาย"
            placeholder="กรอกราคาขาย"
            mb={"xs"}
            {...form.getInputProps("salePrice")}
          />
          <Center>
            <Group justify="space-between" mt={15}>
              <Button color="green" mt="md" type="submit" >
                เพิ่มอ่ะไหล่
              </Button>
              <Button color="red" mt="md" onClick={onClose}>
                ยกเลิก
              </Button>
            </Group>
          </Center>
        </Box>
      </form>
    </Modal>
  );
};

export default AddPartModal;

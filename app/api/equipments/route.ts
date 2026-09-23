import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get("labId");

    const [equipments, labs] = await Promise.all([
      prisma.labEquipment.findMany({
        where: labId ? { labId } : {},
        include: {
          labRoom: true,
          incidents: {
            where: { incidentStatus: { in: ["OPEN", "IN_PROGRESS"] } },
          },
        },
        orderBy: { equipmentBarcode: "asc" },
      }),
      prisma.labRoom.findMany({
        orderBy: { labCode: "asc" },
      }),
    ]);

    return NextResponse.json({ success: true, equipments, labs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { equipmentBarcode, equipmentName, category = "PC", labId, specifications } = body;

    if (!equipmentBarcode || !equipmentName || !labId) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ Mã vạch, Tên máy và Phòng Lab!" },
        { status: 400 }
      );
    }

    const newEquip = await prisma.labEquipment.create({
      data: {
        equipmentBarcode: equipmentBarcode.trim().toUpperCase(),
        equipmentName,
        category,
        labId,
        specifications,
      },
    });

    return NextResponse.json({ success: true, equipment: newEquip });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc trạng thái thiết bị!" }, { status: 400 });
    }

    const updated = await prisma.labEquipment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, equipment: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID thiết bị!" }, { status: 400 });
    }

    await prisma.labEquipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa thiết bị thành công!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

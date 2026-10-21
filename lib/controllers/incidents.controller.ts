import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function handleIncidentsGet(req: NextRequest) {
  try {
    const incidents = await prisma.equipmentIncident.findMany({
      include: {
        equipment: {
          include: { labRoom: true },
        },
        reportedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, incidents });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function handleIncidentsPatch(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, incidentStatus } = body;

    const updated = await prisma.equipmentIncident.update({
      where: { id },
      data: {
        incidentStatus,
        resolvedAt: incidentStatus === "RESOLVED" ? new Date() : null,
      },
      include: { equipment: true },
    });

    // Nếu đã giải quyết sự cố, chuyển trạng thái thiết bị lại GOOD
    if (incidentStatus === "RESOLVED") {
      await prisma.labEquipment.update({
        where: { id: updated.equipmentId },
        data: { status: "GOOD" },
      });
    }

    return NextResponse.json({ success: true, incident: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function handleIncidentsDelete(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID sự cố!" }, { status: 400 });
    }

    await prisma.equipmentIncident.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa sự cố thành công!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

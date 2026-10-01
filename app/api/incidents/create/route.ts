import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { IncidentSeverity, IncidentStatus, EquipmentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      equipmentId,
      studentCode,
      title,
      description = "",
      severity = "MEDIUM",
    } = body;

    if (!equipmentId || !title) {
      return NextResponse.json(
        { success: false, message: "Vui lòng cung cấp mã thiết bị và tiêu đề sự cố!" },
        { status: 400 }
      );
    }

    // Tìm người báo cáo: nếu có studentCode thì lấy User đó, nếu không lấy user đầu tiên
    let reporter = null;
    if (studentCode) {
      reporter = await prisma.user.findUnique({
        where: { studentCode },
      });
    }
    if (!reporter) {
      reporter = await prisma.user.findFirst({
        where: { role: "STUDENT" },
      });
    }

    if (!reporter) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy thông tin tài khoản người báo cáo!" },
        { status: 404 }
      );
    }

    // Tạo sự cố mới
    const incident = await prisma.equipmentIncident.create({
      data: {
        equipmentId,
        reportedByUserId: reporter.id,
        title,
        description,
        severity: severity as IncidentSeverity,
        incidentStatus: IncidentStatus.OPEN,
      },
      include: {
        equipment: true,
        reportedBy: true,
      },
    });

    // Cập nhật trạng thái thiết bị sang BROKEN nếu mức độ sự cố nghiêm trọng
    if (severity === "HIGH" || severity === "CRITICAL") {
      await prisma.labEquipment.update({
        where: { id: equipmentId },
        data: { status: EquipmentStatus.BROKEN },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Đã ghi nhận sự cố "${incident.title}" cho thiết bị ${incident.equipment.equipmentBarcode}!`,
      data: incident,
    });
  } catch (error: any) {
    console.error("POST /api/incidents/create Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tạo sự cố thiết bị" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function handleUsersGet(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        dutySchedules: {
          include: { shift: true, labRoom: true },
        },
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function handleUsersPost(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentCode, fullName, email, phone = "", role = "STUDENT" } = body;

    if (!studentCode || !fullName || !email) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ MSSV, Họ và tên và Email Văn Lang!" },
        { status: 400 }
      );
    }

    const defaultPasswordHash = "$2a$12$K8y4P9Q8y9qGg4.x0G2m4.bL2yB8x6fQ7cT2s7G5k3sP1u6t2A8Qy";

    const user = await prisma.user.create({
      data: {
        studentCode: studentCode.trim(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: defaultPasswordHash,
        phone,
        role: role === "ADMIN" ? "ADMIN" : "STUDENT",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "MSSV hoặc Email này đã tồn tại trong hệ thống!" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function handleUsersDelete(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID người dùng!" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa người dùng thành công!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

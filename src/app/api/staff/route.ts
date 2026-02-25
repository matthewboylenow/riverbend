import { NextRequest, NextResponse } from "next/server";

// Mock staff data for development (will be replaced with DB queries)
const mockStaff = [
  { id: "1", name: "Roger Breene", title: "Director", section: "directors", sortOrder: 0, isActive: true, photoUrl: null, bio: "Roger Breene is Marianne and Harold's oldest child..." },
  { id: "2", name: "Jill Breene Cheng", title: "Director", section: "directors", sortOrder: 1, isActive: true, photoUrl: null, bio: "Jill Breene Cheng has been at Camp Riverbend since she was 5 years old..." },
];

export async function GET() {
  try {
    return NextResponse.json(mockStaff);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newStaff = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(newStaff, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create staff member" },
      { status: 500 }
    );
  }
}

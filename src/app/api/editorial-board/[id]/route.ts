import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/roles';
import { withRetry } from '@/lib/prisma-retry';

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    
    const member = await withRetry(() =>
      prisma.editorialBoard.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          title: true,
          affiliation: true,
          email: true,
          photoUrl: true,
          bio: true,
          isActive: true,
          orderIndex: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      5,
      200
    );

    if (!member) {
      return NextResponse.json({ error: 'Editorial board member not found' }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (err: any) {
    console.error('Editorial board fetch error:', err);
    
    // Log technical details but return user-friendly message
    if (err?.message?.includes('prepared statement')) {
      console.error('Prepared statement error detected. Check Supabase connection pooler mode.');
    }
    
    return NextResponse.json(
      { error: 'Failed to load editorial board member. Please try again.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = requireRole(req, ['ADMIN', 'EDITOR']);
  if ('error' in guard) return guard.error;

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    
    const {
      name,
      title,
      affiliation,
      email,
      photoUrl,
      bio,
      orderIndex,
      isActive,
    } = body || {};

    // Build update data object (only include fields that are provided)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (title !== undefined) updateData.title = title.trim();
    if (affiliation !== undefined) updateData.affiliation = affiliation.trim();
    if (email !== undefined) updateData.email = email?.trim().toLowerCase() || null;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl?.trim() || null;
    if (bio !== undefined) updateData.bio = bio?.trim() || null;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Validate required fields if they're being updated
    if (updateData.name !== undefined && !updateData.name) {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
    }
    if (updateData.title !== undefined && !updateData.title) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }
    if (updateData.affiliation !== undefined && !updateData.affiliation) {
      return NextResponse.json({ error: 'Affiliation cannot be empty' }, { status: 400 });
    }

    // Check if member exists
    const existingMember = await withRetry(() =>
      prisma.editorialBoard.findUnique({
        where: { id },
        select: { id: true },
      })
    );

    if (!existingMember) {
      return NextResponse.json({ error: 'Editorial board member not found' }, { status: 404 });
    }

    // Update the member
    const member = await withRetry(() =>
      prisma.editorialBoard.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          title: true,
          affiliation: true,
          email: true,
          photoUrl: true,
          bio: true,
          isActive: true,
          orderIndex: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Editorial board member updated successfully',
      member,
    });
  } catch (err: any) {
    console.error('Editorial board update error:', err);
    
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Editorial board member not found' }, { status: 404 });
    }
    
    // Log technical details but return user-friendly message
    if (err?.message?.includes('prepared statement')) {
      console.error('Prepared statement error detected. Check Supabase connection pooler mode.');
    }
    
    return NextResponse.json(
      { error: 'Failed to update editorial board member. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = requireRole(req, ['ADMIN', 'EDITOR']);
  if ('error' in guard) return guard.error;

  try {
    const { id } = await ctx.params;
    
    // Check if member exists
    const member = await withRetry(() =>
      prisma.editorialBoard.findUnique({
        where: { id },
        select: { id: true, name: true },
      })
    );

    if (!member) {
      return NextResponse.json({ error: 'Editorial board member not found' }, { status: 404 });
    }

    // Delete the member
    await withRetry(() =>
      prisma.editorialBoard.delete({
        where: { id },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Editorial board member deleted successfully',
    });
  } catch (err: any) {
    console.error('Editorial board delete error:', err);
    
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Editorial board member not found' }, { status: 404 });
    }
    
    // Log technical details but return user-friendly message
    if (err?.message?.includes('prepared statement')) {
      console.error('Prepared statement error detected. Check Supabase connection pooler mode.');
    }
    
    return NextResponse.json(
      { error: 'Failed to delete editorial board member. Please try again.' },
      { status: 500 }
    );
  }
}


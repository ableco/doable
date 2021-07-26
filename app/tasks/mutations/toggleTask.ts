import { resolver } from "blitz";
import db, { Task } from "db";
import { z } from "zod";

const ToggleTaskParams = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(ToggleTaskParams),
  resolver.authorize(),
  async ({ id }, { session }) => {
    const task = await db.task.findFirst({
      where: {
        id,
        OR: [{ assignedUserId: session.userId }, { creatorId: session.userId }],
      },
      rejectOnNotFound: true,
    });

    await db.task.update({
      where: { id: task.id },
      data: { completedAt: task.completedAt ? null : new Date() },
    });
  },
);

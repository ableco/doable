import { resolver } from "blitz";
import db from "db";
import { orderBy, partition } from "lodash";

export default resolver.pipe(resolver.authorize(), async (_, { session }) => {
  const tasks = await db.task.findMany({
    where: {
      OR: [{ assignedUserId: session.userId }, { creatorId: session.userId }],
    },
  });

  // Order is implemented in code and not in the database because it's too complicated
  // for Prisma sorting, as it doesn't support raw sort yet:
  // https://github.com/prisma/prisma/issues/5848
  // https://github.com/prisma/prisma/discussions/8043
  const [completeTasks, incompleteTasks] = partition(
    tasks,
    (task) => !!task.completedAt,
  );

  const sortedCompleteTasks = orderBy(
    completeTasks,
    [
      (task) => !!task.dueDate,
      (task) => task.assignedUserId === session.userId,
      (task) => task.dueDate,
      (task) => task.createdAt,
    ],
    ["desc", "desc", "asc", "asc"],
  );

  const sortedIncompleteTasks = orderBy(
    incompleteTasks,
    [
      (task) => task.assignedUserId === session.userId,
      (task) => task.completedAt,
      (task) => task.createdAt,
    ],
    ["desc", "asc", "asc"],
  );

  return [...sortedCompleteTasks, ...sortedIncompleteTasks];
});

import { Day, PrismaClient, UserSex } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

function randomizeBloodType() {
  const chance = Math.random();
  if(chance < 0.41) return "O+";
  if(chance < 0.73) return "A+";
  if(chance < 0.88) return "B+";
  if(chance < 0.93) return "AB+";
  if(chance < 0.96) return "O-";
  if(chance < 0.985) return "A-";
  if(chance < 0.995) return "B-";
  return "AB-";
}

async function main() {
  // User
  const userAdmin = await prisma.user.create({
    data: {
      username: "admin1",
      password: "$2a$10$1.l4xAnNalrU7Yj8fnMTGO0ZcoxuRM0P.w1ROk6YcszE6ykCGuXhW",
      name: "John Dee",
      email: "john.dee@mail.com",
      role: "ADMIN",
    }
  });
  const userStudent = await prisma.user.create({
    data: {
      username: "student1",
      password: "$2a$10$1.l4xAnNalrU7Yj8fnMTGO0ZcoxuRM0P.w1ROk6YcszE6ykCGuXhW",
      name: "Student 1",
      email: "student1@example.com",
      role: "STUDENT"
    }
  });
  const userTeacher = await prisma.user.create({
    data: {
      username: "teacher1",
      password: "$2a$10$1.l4xAnNalrU7Yj8fnMTGO0ZcoxuRM0P.w1ROk6YcszE6ykCGuXhW",
      name: "Teacher 1",
      email: "teacher1@example.com",
      role: "TEACHER",
    }
  });
  const userParent = await prisma.user.create({
    data: {
      username: "parent1",
      password: "$2a$10$1.l4xAnNalrU7Yj8fnMTGO0ZcoxuRM0P.w1ROk6YcszE6ykCGuXhW",
      name: "Parent1",
      email: "parent1@example.com",
      role: "PARENT",
    }
  });

  // ADMIN
  await prisma.admin.create({
    data: {
      userId: userAdmin.id,
    },
  });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`, 
        gradeId: i, 
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER
  for (let i = 1; i <= 35; i++) {
    const teacher = faker.person;
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`, // Unique ID for the teacher
        // username: i === 1 ? `teacher${i}` : undefined,
        userId: i === 1 ? userTeacher.id : undefined,
        name: teacher.firstName(), 
        surname: teacher.lastName(),
        email: faker.internet.email({firstName: teacher.firstName(), lastName: teacher.lastName()}),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        bloodType: randomizeBloodType(),
        sex: teacher.sex() === "female" ? UserSex.FEMALE : UserSex.MALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] }, 
        classes: { connect: [{ id: (i % 6) + 1 }] }, 
        birthday: faker.date.birthdate({ mode: 'age', min: 25, max: 65 }),
      },
    });
  }

  // LESSON
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`, 
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ], 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
        subjectId: (i % 10) + 1, 
        classId: (i % 6) + 1, 
        teacherId: `teacher${(i % 15) + 1}`, 
      },
    });
  }

  // PARENT
  const parents: {[key: string]: {
    id: string;
    username?: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
  }} = {};
  for (let i = 1; i <= 250; i++) {
    const parentModule = faker.person;
    const parent = {
      id: `parentId${i}`,
      // username: i === 1 ? `parent${i}` : undefined,
      userId: i === 1 ? userParent.id : undefined,
      name: parentModule.firstName(),
      surname: parentModule.lastName(),
      email: faker.internet.email({firstName: parentModule.firstName(), lastName: parentModule.lastName()}),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
    }
    await prisma.parent.create({
      data: {...parent },
    });
    parents[parent.id] = parent;
  }

  // STUDENT
  let count = 0
  for (const parentId in parents) {
    const parent = parents[parentId]
    const numChild = Math.round(Math.random() * 2) + 1;
    for (let i = 1; i <= numChild; i++) {
      const student = faker.person;
      await prisma.student.create({
        data: {
          id: `student${count}`, 
          // username: count === 1 ? `student${count}` : undefined, 
          userId: count === 1 ? userStudent.id : undefined,
          name: student.firstName(),
          surname: parent.surname,
          email: faker.internet.email({firstName: student.firstName(), lastName: parent.surname}),
          phone: parent.phone,
          address: parent.address,
          bloodType: randomizeBloodType(),
          sex: student.sex() === "male" ? UserSex.MALE : UserSex.FEMALE,
          parentId: parentId, 
          gradeId: (count % 6) + 1, 
          classId: (count % 6) + 1, 
          birthday: faker.date.birthdate({ mode: 'age', min: 5, max: 12 }),
        },
      });
      count++;
    }
  }

  // STUDENT
  // for (let i = 1; i <= 500; i++) {
  //   const student = faker.person;
  //   const parentId = `parentId${Math.ceil(i / 2) % 25 || 25}`;
  //   const parent = parents[parentId];
  //   await prisma.student.create({
  //     data: {
  //       id: `student${i}`, 
  //       username: i === 1 ? `student${i}` : undefined, 
  //       // userId: userStudent.id,
  //       name: student.firstName(),
  //       surname: parent.surname,
  //       email: faker.internet.email({firstName: student.firstName(), lastName: parent.surname}),
  //       phone: parent.phone,
  //       address: parent.address,
  //       bloodType: "O-",
  //       sex: student.sex() === "male" ? UserSex.MALE : UserSex.FEMALE,
  //       parentId: parentId, 
  //       gradeId: (i % 6) + 1, 
  //       classId: (i % 6) + 1, 
  //       birthday: faker.date.birthdate({ mode: 'age', min: 5, max: 12 }),
  //     },
  //   });
  // }

  // EXAM
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`, 
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90, 
        studentId: `student${i}`, 
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(), 
        present: true, 
        studentId: `student${i}`, 
        lessonId: (i % 30) + 1, 
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`, 
        description: `Description for Event ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        classId: (i % 5) + 1, 
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`, 
        description: `Description for Announcement ${i}`, 
        date: new Date(), 
        classId: (i % 5) + 1, 
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
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

function randomizeDate(startHour: number, endHour: number) {
  if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
    throw new Error('Hours must be between 0 and 23');
  }
  
  // Generate random hour between startHour and endHour
  const randomHour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  
  const currentDate = new Date();
  currentDate.setHours(randomHour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0);

  return currentDate;
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
  const lessons = [];
  for (let i = 1; i <= 30; i++) {
    const randomStarttime = randomizeDate(8, 14);
    lessons.push({
        name: `Lesson${i}`, 
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ], 
        startTime: randomStarttime.toISOString(), 
        endTime: new Date(new Date().setHours(randomStarttime.getHours() + 3)).toISOString(), 
        subjectId: (i % 10) + 1, 
        classId: (i % 6) + 1, 
        teacherId: `teacher${(i % 15) + 1}`, 
      })
  }
  await prisma.lesson.createMany({
    data: lessons,
  });

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
    parents[parent.id] = parent;
  }
  await prisma.parent.createMany({
    data: Object.values(parents),
  });

  // STUDENT
  let count = 0
  const students = []
  for (const parentId in parents) {
    const parent = parents[parentId]
    const numChild = Math.round(Math.random() * 2) + 1;
    for (let i = 1; i <= numChild; i++) {
      const student = faker.person;
      students.push({
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
      });
      count++;
    }
  }
  await prisma.student.createMany({
    data: students
  });

  // EXAM
  const exams = [];
  for (let i = 1; i <= 10; i++) {
    const randomStarttime = randomizeDate(8, 15);
    exams.push({
      title: `Exam ${i}`, 
      startTime: randomStarttime.toISOString(), 
      endTime: new Date(new Date().setHours(randomStarttime.getHours() + 2)).toISOString(), 
      lessonId: (i % 30) + 1, 
    });
  }
  await prisma.exam.createMany({
    data: exams,
  });

  // ASSIGNMENT
  const assignments = []
  for (let i = 1; i <= 10; i++) {
    const randomStarttime = randomizeDate(8, 15);
    assignments.push({
      title: `Assignment ${i}`, 
      startDate: randomStarttime.toISOString(), 
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), 
      lessonId: (i % 30) + 1, 
    });
  }
  await prisma.assignment.createMany({
    data: assignments
  });

  // RESULT
  const results = [];
  for (let i = 1; i <= 10; i++) {
    results.push({
      score: 90, 
      studentId: `student${i}`, 
      ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
    })
  }
  await prisma.result.createMany({
    data: results
  });

  // ATTENDANCE
  const attendances = [];
  for (let i = 1; i <= 10; i++) {
    attendances.push({
      date: new Date(), 
      present: true, 
      studentId: `student${i}`, 
      lessonId: (i % 30) + 1, 
    })
  }
  await prisma.attendance.createMany({
    data: attendances
  });

  // EVENT
  const events = [];
  for (let i = 1; i <= 5; i++) {
    events.push({
      title: `Event ${i}`, 
      description: `Description for Event ${i}`, 
      startTime: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(), 
      endTime: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString(), 
      classId: (i % 5) + 1, 
    })
  }
  await prisma.event.createMany({
    data: events
  });

  // ANNOUNCEMENT
  const announcements = [];
  for (let i = 1; i <= 5; i++) {
    announcements.push({
      title: `Announcement ${i}`, 
      description: `Description for Announcement ${i}`, 
      date: new Date(), 
      classId: (i % 5) + 1, 
    });
  }
  await prisma.announcement.createMany({
    data: announcements,
  });

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
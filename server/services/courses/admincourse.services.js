import Course from '../../models/courses/Course.model.js';
import User from '../../models/user.model.js';
import { createNotFoundError, createBadRequestError, createForbiddenError } from '../../utils/appError.js';


import slugify from 'slugify'; // Dynamic URL generator package

/**
 * Fetch the course list shown to staff in the admin dashboard.
 * Admins see every course (all statuses); teachers only see their own.
 */
export const getAdminCourses = async (clerkUserId, userRole) => {
  const filter = {};

  if (userRole !== 'admin') {
    const instructorUser = await User.findOne({ clerkId: clerkUserId });
    if (!instructorUser) {
      throw createNotFoundError('Instructor profile not found in ERP system');
    }
    filter.instructor = instructorUser._id;
  }

  return await Course.find(filter)
    .populate('instructor', 'name avatarUrl title email')
    .populate('tags', 'name slug')
    .sort({ createdAt: -1 });
};

/**
 * Create a new course record
 */
export const createNewCourse = async (courseData, clerkUserId) => {
  // 1. Find the local MongoDB User ID using the Clerk User ID string
  const instructorUser = await User.findOne({ clerkId: clerkUserId });
  if (!instructorUser) {
    throw createNotFoundError('Instructor profile not found in ERP system');
  }

  // 2. Automated slug generator (turns "AI Basics 101" into "ai-basics-101")
  const generatedSlug = slugify(courseData.title, { lower: true, strict: true });

  // 3. Check for slug collision
  const existingCourse = await Course.findOne({ slug: generatedSlug });
  if (existingCourse) {
    throw createBadRequestError('A course with this title or slug already exists');
  }

  // 4. Save into Database
  const newCourse = new Course({
    ...courseData,
    slug: generatedSlug,
    instructor: instructorUser._id // Links the MongoDB Object ID reference
  });

  return await newCourse.save();
};

/**
 * Edit an existing course record
 */
export const updateCourseDetails = async (courseSlug, updateData, clerkUserId, userRole) => {
  // 1. Fetch the course target by slug
  const course = await Course.findOne({ slug: courseSlug });
  if (!course) {
    throw createNotFoundError('Course target not found');
  }

  // 2. Security Check: Teachers can only edit THEIR own courses. Admins can edit anything.
  if (userRole !== 'admin') {
    const instructorUser = await User.findOne({ clerkId: clerkUserId });
    if (!course.instructor.equals(instructorUser?._id)) {
      throw createForbiddenError('Unauthorised: You can only modify courses assigned to you');
    }
  }

  // 3. If the title changes, regenerate a clean URL slug
  if (updateData.title) {
    updateData.slug = slugify(updateData.title, { lower: true, strict: true });
  }

  // 4. Execute database update execution
  return await Course.findByIdAndUpdate(
    course._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

/**
 * Delete an existing course record
 */
export const deleteCourseDetails = async (courseSlug, clerkUserId, userRole) => {
  // 1. Fetch the course target by slug
  const course = await Course.findOne({ slug: courseSlug });
  if (!course) {
    throw createNotFoundError('Course target not found');
  }

  // 2. Security Check: Teachers can only delete THEIR own courses. Admins can delete anything.
  if (userRole !== 'admin') {
    const instructorUser = await User.findOne({ clerkId: clerkUserId });
    if (!course.instructor.equals(instructorUser?._id)) {
      throw createForbiddenError('Unauthorised: You can only delete courses assigned to you');
    }
  }

  // 3. Execute database delete execution
  await Course.findByIdAndDelete(course._id);

  return { id: course._id, slug: course.slug, title: course.title };
};

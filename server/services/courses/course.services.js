import Course from '../../models/courses/Course.model.js';
import Category from "../../models/courses/Category.model.js";
import { createNotFoundError } from '../../utils/appError.js';

/**
 * Fetch courses with advanced search, filtering, and pagination
 */
export const getAllCourses = async (queryParams) => {
  const { search, level, type, tag, page = 1, limit = 10 } = queryParams;
  
  // 1. Build the dynamic database query object
  const query = { status: 'published' }; // Only show published courses to the public

  // Text search (Title or Description)
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by difficulty level
  if (level) {
    query.level = level;
  }

  // Filter by course structure type
  if (type) {
    query.courseType = type;
  }

  // Filter by Category Slug
  if (tag) {
    const category = await Category.findOne({ slug: tag.toLowerCase() }).lean();
    if (category) {
      query.tags = category._id;
    } else {
      // If the tag doesn't exist, return empty results early
      return { courses: [], total: 0, page: parseInt(page), pages: 0 };
    }
  }

  // 2. Setup Pagination math
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // 3. Execute DB queries simultaneously to save performance time
  // Use .lean() for read-only list views - faster, less memory
  const projection = { 
    title: 1, slug: 1, description: 1, thumbnailUrl: 1, duration: 1,
    courseType: 1, level: 1, isPopular: 1, status: 1,
    instructor: 1, tags: 1, createdAt: 1
  };

  const coursesPromise = Course.find(query, projection)
    .populate('instructor', 'name avatarUrl title')
    .populate('tags', 'name slug')
    .skip(skip)
    .limit(parseInt(limit))
    .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .lean(); // Returns plain JS objects, not Mongoose documents

  const countPromise = Course.countDocuments(query);

  const [courses, total] = await Promise.all([coursesPromise, countPromise]);

  return {
    courses,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

/**
 * Fetch top featured / popular courses for homepage banners
 */
export const getFeaturedCourses = async () => {
  const projection = { 
    title: 1, slug: 1, description: 1, thumbnailUrl: 1, duration: 1,
    courseType: 1, level: 1, isPopular: 1, status: 1,
    instructor: 1, tags: 1, createdAt: 1
  };
  
  return await Course.find({ isPopular: true, status: 'published' }, projection)
    .populate('instructor', 'name avatarUrl title')
    .populate('tags', 'name slug')
    .limit(4)
    .lean();
};

/**
 * Fetch a single course by its unique slug
 */
export const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({ slug, status: 'published' })
    .populate('instructor', 'name avatarUrl title bio')
    .populate('tags', 'name slug')
    .lean();
    
  if (!course) {
    throw createNotFoundError('Course not found');
  }
  return course;
};

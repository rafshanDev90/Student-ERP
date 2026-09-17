import { jest, describe, it, expect, beforeEach, afterEach, beforeAll } from '@jest/globals';
import { errorMiddleware } from '../ErrorMiddleware.js';
import express from 'express';
import request from 'supertest';

describe('errorMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', originalUrl: '/test-route' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fall back to status 500 and "Internal Server Error"', () => {
    const error = new Error();

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Internal Server Error',
      })
    );
  });

  it('should use custom error status and message if provided', () => {
    const error = new Error('Custom Bad Request');
    error.statusCode = 400;

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Custom Bad Request',
      })
    );
  });

  it('should include the stack trace only in development environment', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Dev Error');

    errorMiddleware(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String),
      })
    );
  });
});

describe('errorMiddleware Integration', () => {
  let app;

  beforeAll(() => {
    app = express();

    app.get('/crash', (req, res, next) => {
      throw new Error('Database connection failed');
    });

    app.get('/bad-request', (req, res, next) => {
      const err = new Error('Invalid Input Data');
      err.statusCode = 400;
      next(err);
    });

    app.use(errorMiddleware);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should catch unhandled route exceptions and return 500', async () => {
    const response = await request(app).get('/crash');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Database connection failed');
  });

  it('should catch passed errors and return the correct status', async () => {
    const response = await request(app).get('/bad-request');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Input Data');
  });
});

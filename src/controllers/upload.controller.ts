import { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import { handleFileUpload } from '../utils/upload.util.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const uploadController = {
  async uploadImage(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();
    if (!data) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: MESSAGES.NO_FILE_UPLOADED });
    }

    try {
      const url = await handleFileUpload(data, 'images');
      return {
        success: true,
        data: { url }
      };
    } catch (err: any) {
      request.log.error(err);
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ success: false, error: `Image upload failed: ${err.message || err}` });
    }
  },

  async uploadAudio(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();
    if (!data) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: MESSAGES.NO_FILE_UPLOADED });
    }

    const ext = path.extname(data.filename).toLowerCase();
    if (ext !== '.mp3' && ext !== '.m4a' && ext !== '.wav' && ext !== '.ogg' && ext !== '.mp4') {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({ success: false, error: MESSAGES.INVALID_AUDIO_FORMAT });
    }

    try {
      const url = await handleFileUpload(data, 'audio');
      return {
        success: true,
        data: { url }
      };
    } catch (err: any) {
      request.log.error(err);
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ success: false, error: `Audio upload failed: ${err.message || err}` });
    }
  }
};

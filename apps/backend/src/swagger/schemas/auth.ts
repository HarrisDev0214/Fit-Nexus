export const signupSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['name', 'email', 'password', 'sex'],
    properties: {
      name: {
        type: 'string',
        example: 'John'
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      password: {
        type: 'string',
        example: 'password123'
      },
      sex: {
        type: 'string',
        enum: ['male', 'female'],
        example: 'male'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Verification email sent'
      },
      data: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'user@example.com'
          }
        }
      }
    }
  }
};

export const loginSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      password: {
        type: 'string',
        example: 'password123'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          }
        }
      }
    }
  }
};

export const logoutSchema: SwaggerSchema = {
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      }
    }
  }
};

export const updatePasswordSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['oldPassword', 'newPassword'],
    properties: {
      oldPassword: {
        type: 'string',
        example: 'oldPassword123'
      },
      newPassword: {
        type: 'string',
        example: 'newPassword456'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      }
    }
  }
};

export const refreshTokenSchema: SwaggerSchema = {
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          }
        }
      }
    }
  }
};

export const verifyEmailOtpSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email', 'otp'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      otp: {
        type: 'string',
        pattern: '^\\d{6}$',
        example: '123456'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Email verified successfully'
      }
    }
  }
};

export const recreateEmailOtpSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Verification email sent'
      }
    }
  }
};

export const createPasswordResetOtpSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'If this email is registered, you will receive a verification code'
      }
    }
  }
};

export const verifyPasswordResetOtpSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['email', 'otp'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com'
      },
      otp: {
        type: 'string',
        pattern: '^\\d{6}$',
        example: '123456'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      data: {
        type: 'object',
        properties: {
          resetToken: {
            type: 'string',
            description: 'Token to use for password reset',
            example: 'a1b2c3d4e5f6...'
          }
        }
      }
    }
  }
};

export const resetPasswordSchema: SwaggerSchema = {
  request: {
    type: 'object',
    required: ['resetToken', 'newPassword', 'confirmNewPassword'],
    properties: {
      resetToken: {
        type: 'string',
        description: 'Token obtained from password/verify endpoint',
        example: 'a1b2c3d4e5f6...'
      },
      newPassword: {
        type: 'string',
        example: 'newPassword123'
      },
      confirmNewPassword: {
        type: 'string',
        example: 'newPassword123'
      }
    }
  },
  response: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'success'
      },
      message: {
        type: 'string',
        example: 'Password reset successfully'
      }
    }
  }
};

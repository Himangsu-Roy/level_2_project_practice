import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);



academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isDepartmentExist) {
    throw new AppError('Department already exist', 404);
  }

  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  // academic department does not exist
  const isDepartmentExist = await AcademicDepartment.findOne({
    query,
  });

  if (!isDepartmentExist) {
    throw new AppError('Department already exist', 404);
    // throw new Error('Department does not exist');
  }

  next();
});

const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);

export default AcademicDepartment;

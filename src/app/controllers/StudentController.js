import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      stature: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      res.status(400).json({ error: 'Student already exists' });
    }

    const { id, name, email, age, weight, stature } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      stature,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      stature: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { email } = req.body;
    const student = await Student.findByPk(req.params.id);

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        res.status(401).json({ error: 'Student already exists' });
      }
    }

    const { id, name, age, weight, stature } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      stature,
    });
  }
}

export default new StudentController();

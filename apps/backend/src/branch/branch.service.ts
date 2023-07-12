import { Injectable } from '@nestjs/common';
import { CreateBranchInput } from './dto/create-branch.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  create(createBranchInput: CreateBranchInput) {
    return this.branchRepository.save(createBranchInput);
  }

  findAll() {
    return this.branchRepository.find();
  }

  async findOneByNane(branchName: string): Promise<Branch | null> {
    const branch = await this.branchRepository.findOne({
      where: {
        name: branchName,
      },
    });
    return branch;
  }

  async findOrCreateByNane(name: string) {
    const branch = await this.findOneByNane(name);
    return branch || (await this.create({ name }));
  }

  async findAllScreenshots(branch: Branch) {
    const reloadedBranch = await this.branchRepository.findOne({
      where: {
        id: branch.id,
      },
      relations: ['branchScreenshots'],
    });
    return reloadedBranch?.branchScreenshots;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}

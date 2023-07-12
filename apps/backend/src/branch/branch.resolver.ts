import { Resolver, Query, Args, Parent, ResolveField } from '@nestjs/graphql';
import { BranchService } from './branch.service';
import { Branch } from './entities/branch.entity';
import { BranchScreenshot } from '../branch-screenshot/entities/branch-screenshot.entity';

@Resolver(() => Branch)
export class BranchResolver {
  constructor(private readonly branchService: BranchService) {}

  @Query(() => [Branch])
  branches() {
    return this.branchService.findAll();
  }

  @Query(() => Branch)
  branch(@Args('branchName', { type: () => String }) branchName: string) {
    return this.branchService.findOneByNane(branchName);
  }

  @ResolveField(() => [BranchScreenshot], {
    name: 'branchScreenshots',
  })
  branchScreenshots(@Parent() branch: Branch) {
    return this.branchService.findAllScreenshots(branch);
  }
}

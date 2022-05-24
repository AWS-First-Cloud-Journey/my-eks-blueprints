// lib/pipeline.ts
import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { Construct } from 'constructs';

import { TeamPlatform, TeamApplication } from '../teams'; // HERE WE IMPORT TEAMS

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct: string, props?: cdk.StackProps){
    super(scope,id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    
    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns()
    .teams(new TeamPlatform(account), new TeamApplication('burnham',account));
  
    blueprints.CodePipelineStack.builder()
      .name("eks-blueprints-workshop-pipeline")
      .owner("First-Cloud-Journey")
      .repository({
          repoUrl: 'my-eks-blueprints',
          credentialsSecretName: 'github-token',
          targetRevision: 'main'
      })
      .wave({
        id: "envs",
        stages: [
          { id: "dev", stackBuilder: blueprint.clone('ap-southeast-1')}
        ]
      })
      .build(scope, id+'-stack', props);
  }
}
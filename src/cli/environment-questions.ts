import { QuestionSet, Question } from 'nest-commander';

@QuestionSet({ name: 'environment' })
export class EnvironmentQuestions {
  @Question({
    type: 'list',
    name: 'cluster',
    choices: [
      {
        value: 'devnet',
        checked: true,
      },
      {
        value: 'mainnet-beta',
      },
    ],
    message: `Which cluster do you wish to use?`,
    validate: function (value: string) {
      if (value === 'devnet' || value === 'mainnet-beta') {
        return true;
      }
      return "Please enter either 'devnet' or 'mainnet-beta'";
    },
  })
  parseCluster(cluster: string): string {
    return cluster;
  }

  @Question({
    type: 'input',
    name: 'heliusApiKey',
    message: "What's your Helius API key?",
    validate: function (value: string) {
      // TODO: fire a dummy HTTP request towards Helius API to check if the key is valid
      if (!!value) return true;
      return 'Please enter a Helius API key';
    },
  })
  parseHeliusApiKey(heliusApiKey: string): string {
    return heliusApiKey;
  }
}

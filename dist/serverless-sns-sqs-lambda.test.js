"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CLI_1 = __importDefault(require("serverless/lib/classes/CLI"));
var provider_1 = __importDefault(require("serverless/lib/plugins/aws/provider"));
var Serverless_1 = __importDefault(require("serverless/lib/Serverless"));
var serverless_sns_sqs_lambda_1 = __importDefault(require("./serverless-sns-sqs-lambda"));
var slsOpt = {
    stage: "dev-test",
    region: "ap-southeast-2"
};
describe("Test Serverless SNS SQS Lambda", function () {
    var serverless;
    var serverlessSnsSqsLambda;
    beforeEach(function () {
        serverless = new Serverless_1.default();
        var options = __assign({}, slsOpt);
        serverless.setProvider("aws", new provider_1.default(serverless));
        serverless.cli = new CLI_1.default(serverless);
        serverlessSnsSqsLambda = new serverless_sns_sqs_lambda_1.default(serverless, options);
    });
    afterEach(function () {
        jest.resetModules(); // reset modules after each test
    });
    it("should have one hook", function () {
        (function () {
            expect(serverlessSnsSqsLambda.hooks.length).toBe(1);
            expect(serverlessSnsSqsLambda.hooks[0].keys).toBe("aws:package:finalize:mergeCustomProviderResources");
        });
    });
    it("should set the provider variable to an instance of AwsProvider", function () {
        return expect(serverlessSnsSqsLambda.provider).toBeInstanceOf(provider_1.default);
    });
    it("should have access to the serverless instance", function () {
        return expect(serverlessSnsSqsLambda.serverless).toEqual(serverless);
    });
    it("should set the options variable", function () {
        return expect(serverlessSnsSqsLambda.options).toEqual(__assign({}, slsOpt));
    });
    it("should fail if name is not passed", function () {
        expect.assertions(1);
        expect(function () {
            serverlessSnsSqsLambda.validateConfig("func-name", "stage", {
                topicArn: "topicArn",
                name: undefined
            });
        }).toThrow(/name was \[undefined\]/);
    });
    it("should fail if topicArn is not passed", function () {
        expect.assertions(1);
        expect(function () {
            serverlessSnsSqsLambda.validateConfig("func-name", "stage", {
                topicArn: undefined,
                name: "name"
            });
        }).toThrow(/topicArn was \[undefined\]/);
    });
    describe("when no optional parameters are provided", function () {
        it("should produce valid SQS CF template items", function () {
            var template = { Resources: {} };
            var testConfig = {
                name: "some-name",
                topicArn: "arn:aws:sns:us-east-2:123456789012:MyTopic"
            };
            var validatedConfig = serverlessSnsSqsLambda.validateConfig("test-function", "test-stage", testConfig);
            serverlessSnsSqsLambda.addEventQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventDeadLetterQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventSourceMapping(template, validatedConfig);
            serverlessSnsSqsLambda.addTopicSubscription(template, validatedConfig);
            expect(template).toMatchSnapshot();
        });
    });
    describe("when all parameters are provided", function () {
        it("should produce valid SQS CF template items", function () {
            var template = { Resources: {} };
            var testConfig = {
                name: "some-name",
                topicArn: "arn:aws:sns:us-east-2:123456789012:MyTopic",
                batchSize: 7,
                maximumBatchingWindowInSeconds: 99,
                prefix: "some prefix",
                maxRetryCount: 4,
                kmsMasterKeyId: "some key",
                kmsDataKeyReusePeriodSeconds: 200,
                deadLetterMessageRetentionPeriodSeconds: 1209600,
                enabled: false,
                visibilityTimeout: 999,
                rawMessageDelivery: true,
                filterPolicy: { pet: ["dog", "cat"] }
            };
            var validatedConfig = serverlessSnsSqsLambda.validateConfig("test-function", "test-stage", testConfig);
            serverlessSnsSqsLambda.addEventQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventDeadLetterQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventSourceMapping(template, validatedConfig);
            serverlessSnsSqsLambda.addTopicSubscription(template, validatedConfig);
            expect(template).toMatchSnapshot();
        });
        it("should produce valid SQS FIFO CF template items", function () {
            var template = { Resources: {} };
            var testConfig = {
                name: "some-name",
                topicArn: "arn:aws:sns:us-east-2:123456789012:MyTopic",
                batchSize: 7,
                maximumBatchingWindowInSeconds: 99,
                prefix: "some prefix",
                maxRetryCount: 4,
                kmsMasterKeyId: "some key",
                kmsDataKeyReusePeriodSeconds: 200,
                fifoQueue: true,
                fifoThroughputLimit: "perMessageGroupId",
                deduplicationScope: "messageGroup",
                deadLetterMessageRetentionPeriodSeconds: 1209600,
                enabled: false,
                visibilityTimeout: 999,
                rawMessageDelivery: true,
                filterPolicy: { pet: ["dog", "cat"] }
            };
            var validatedConfig = serverlessSnsSqsLambda.validateConfig("test-function", "test-stage", testConfig);
            serverlessSnsSqsLambda.addEventQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventDeadLetterQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventSourceMapping(template, validatedConfig);
            serverlessSnsSqsLambda.addTopicSubscription(template, validatedConfig);
            expect(template).toMatchSnapshot();
        });
    });
    describe("when encryption parameters are not provided", function () {
        it("should produce valid SQS CF template items", function () {
            var template = { Resources: {} };
            var testConfig = {
                name: "some-name",
                topicArn: "arn:aws:sns:us-east-2:123456789012:MyTopic",
                prefix: "some prefix",
                maxRetryCount: 4
            };
            var validatedConfig = serverlessSnsSqsLambda.validateConfig("test-function", "test-stage", testConfig);
            serverlessSnsSqsLambda.addEventQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventDeadLetterQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventSourceMapping(template, validatedConfig);
            serverlessSnsSqsLambda.addTopicSubscription(template, validatedConfig);
            expect(template).toMatchSnapshot();
        });
    });
    describe("when overriding the generated CloudFormation template", function () {
        it("the overrides should take precedence", function () {
            var template = { Resources: {} };
            var testConfig = {
                name: "some-name",
                topicArn: "arn:aws:sns:us-east-2:123456789012:MyTopic",
                prefix: "some prefix",
                maxRetryCount: 4,
                enabled: true,
                visibilityTimeout: 1234,
                deadLetterMessageRetentionPeriodSeconds: 120,
                rawMessageDelivery: true,
                mainQueueOverride: {
                    visibilityTimeout: 4321
                },
                deadLetterQueueOverride: {
                    MessageRetentionPeriod: 1000
                },
                eventSourceMappingOverride: {
                    Enabled: false
                },
                subscriptionOverride: {
                    rawMessageDelivery: false
                }
            };
            var validatedConfig = serverlessSnsSqsLambda.validateConfig("test-function", "test-stage", testConfig);
            serverlessSnsSqsLambda.addEventQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventDeadLetterQueue(template, validatedConfig);
            serverlessSnsSqsLambda.addEventSourceMapping(template, validatedConfig);
            serverlessSnsSqsLambda.addTopicSubscription(template, validatedConfig);
            expect(template).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=serverless-sns-sqs-lambda.test.js.map
import Icon, {
  CommentOutlined,
  EditOutlined,
  LikeOutlined,
  MoreOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { App, Button, Card, Dropdown, Popover, Typography } from "antd";
import dayjs from "dayjs";
import Haha from "../../assets/icons/Haha";
import Like from "../../assets/icons/Like";
import Love from "../../assets/icons/Love";
import Sad from "../../assets/icons/Sad";
import apiClient from "../../config/axios";
import usePostStore from "./store";
import { PostDto, ReactionEnum, ReactionType } from "./types";
import Wow from "../../assets/icons/Wow";
import Hate from "../../assets/icons/Hate";
import { useAuthStore } from "../auth/store";
import { groupBy, sortBy } from "lodash";
import { useCallback, useMemo } from "react";

type Props = PostDto;

export default function Post(props: Props) {
  const { notification } = App.useApp();

  const profile = useAuthStore((state) => state.profile);
  const postList = usePostStore((state) => state.postList);
  const setPostList = usePostStore((state) => state.setPostList);
  const patchPostForm = usePostStore((state) => state.patchForm);

  const title = (
    <span className="flex flex-col">
      <h3>{props.author.fullName}</h3>
      <span className="text-xs text-slate-500">
        {dayjs(props.createdAt).format("YYYY-MM-DD")}
      </span>
    </span>
  );

  const extraAction = (
    <Dropdown
      menu={{
        items: [
          {
            key: "edit",
            label: "Sửa",
            icon: <EditOutlined />,
            onClick: () => patchPostForm({ type: "update", data: props }),
          },
        ],
      }}
    >
      <Button
        type="text"
        shape="circle"
        icon={<MoreOutlined style={{ fontSize: 20 }} />}
      />
    </Dropdown>
  );

  function mapReaction(type?: ReactionType) {
    return type === "LIKE"
      ? Like
      : type === "HAHA"
      ? Haha
      : type === "LOVE"
      ? Love
      : type === "SAD"
      ? Sad
      : type === "WOW"
      ? Wow
      : type === "HATE"
      ? Hate
      : Like;
  }

  const handleReact = async (type?: ReactionType) => {
    const response = await apiClient.patch(
      `/posts/${props.id}/react?type=${type ?? ""}`
    );
    if (response.success) {
      // Handle react
      if (type) {
        setPostList(
          postList.map((item) => {
            if (item.id === props.id) {
              return {
                ...item,
                reacted: response.data.type,
                reactions: [...props.reactions, response.data],
                _count: {
                  ...props._count,
                  reactions: props._count?.reactions
                    ? props._count?.reactions + 1
                    : 1,
                },
              };
            }
            return item;
          })
        );
      }
      // Handle remove react
      else {
        setPostList(
          postList.map((item) => {
            if (item.id === props.id) {
              return {
                ...item,
                reactions: props.reactions.filter(
                  (reaction) => reaction.userId !== response.data.userId
                ),
                _count: {
                  ...props._count,
                  reactions: props._count?.reactions
                    ? props._count?.reactions - 1
                    : 0,
                },
              };
            }
            return item;
          })
        );
      }
    } else {
      notification.error({ message: response.message });
    }
  };

  const actions = [
    props.reactions?.find((item) => item.userId === profile?.userId) ? (
      <Icon
        component={mapReaction(props.reacted)}
        onClick={() => handleReact()}
      />
    ) : (
      <Popover
        mouseEnterDelay={1}
        content={
          <span className="flex flex-row items-center gap-2">
            {Object.values(ReactionEnum).map((reaction) => (
              <Icon
                key={reaction}
                component={mapReaction(reaction)}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => handleReact(reaction)}
              />
            ))}
          </span>
        }
      >
        <LikeOutlined
          style={{ fontSize: 20, marginBlock: 4 }}
          onClick={() => handleReact("LIKE")}
        />
      </Popover>
    ),
    <CommentOutlined style={{ fontSize: 20, marginBlock: 4 }} />,
    <ShareAltOutlined style={{ fontSize: 20, marginBlock: 4 }} />,
  ];

  const reactionCount = useMemo(() => {
    const arr = [];
    const i = groupBy(props.reactions, "type");
    for (const key in i) {
      if (Object.prototype.hasOwnProperty.call(i, key)) {
        const value = i[key];
        arr.push({
          type: key as ReactionType,
          count: value.length,
        });
      }
    }
    return sortBy(arr, "count").slice(0, 2);
  }, [props.reactions]);
  return (
    <Card
      title={title}
      extra={extraAction}
      actions={actions}
      bodyStyle={{ paddingBottom: "8px" }}
    >
      <Card.Meta
        title={props.title}
        description={
          <Typography.Paragraph
            style={{ opacity: 0.8 }}
            ellipsis={{ rows: 4, expandable: true, symbol: "more" }}
          >
            {props.content}
          </Typography.Paragraph>
        }
      />
      {/* Reactions count and comments */}
      <span className="h-8 flex flex-row w-full items-center justify-between text-xs font-light">
        {props.reactions?.length > 0 ? (
          <span className="flex flex-row items-center text-lg space-x-0 cursor-pointer select-none">
            {reactionCount.map((item, index) => (
              <span
                key={index}
                className="h-6 w-6 flex items-center justify-center"
              >
                <Icon
                  style={{ fontSize: 12 }}
                  component={mapReaction(item.type)}
                />
              </span>
            ))}
            <p className="pl-1 text-xs text-slate-500">
              {props._count?.reactions}
            </p>
          </span>
        ) : (
          <p className="invisible">Haha</p>
        )}
        {true && <span>{`${10} bình luận`}</span>}
      </span>
    </Card>
  );
}
